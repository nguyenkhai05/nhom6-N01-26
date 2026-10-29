import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { Repository } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Course, CourseStatus } from './course.entity.js';
import { CourseService } from './course.service.js';
import type { JwtPayload } from '../auth/jwt.util.js';

function makeUser(overrides: Partial<JwtPayload> = {}): JwtPayload {
  return {
    sub: 10,
    email: 'instructor@eduviet.vn',
    roles: ['Instructor'],
    iat: 1,
    exp: 9999999999,
    ...overrides,
  };
}

function makeCourse(overrides: Partial<Course> = {}): Course {
  return {
    course_id: 1,
    instructor_id: 10,
    category_id: 2,
    title: 'React cơ bản',
    slug: 'react-co-ban',
    description: 'Mô tả khóa học',
    thumbnail_url: '',
    price: 100000,
    level: 'Beginner' as Course['level'],
    status: CourseStatus.PUBLISHED,
    created_at: new Date('2026-01-01T00:00:00Z'),
    instructor: {
      user_id: 10,
      full_name: 'Nguyen Van A',
      email: 'private@example.com',
      avatar_url: null,
    } as Course['instructor'],
    category: { category_id: 2, category_name: 'Frontend' } as Course['category'],
    modules: [],
    enrollments: [],
    ...overrides,
  } as Course;
}

describe('CourseService', () => {
  let service: CourseService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => data),
      update: vi.fn(async () => ({ affected: 1 })),
      delete: vi.fn(async () => ({ affected: 1 })),
    };
    service = new CourseService(repository as unknown as Repository<Course>);
  });

  it('chỉ truy vấn khóa học Published ở danh sách công khai', async () => {
    repository.find.mockResolvedValue([makeCourse()]);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({
      where: { status: CourseStatus.PUBLISHED },
      relations: { category: true, instructor: true },
    });
    expect(result).toHaveLength(1);
  });

  it('không trả email giảng viên trong dữ liệu công khai', async () => {
    repository.find.mockResolvedValue([makeCourse()]);

    const [course] = await service.findAll();

    expect(course.instructor).toMatchObject({ user_id: 10, full_name: 'Nguyen Van A' });
    expect(course.instructor).not.toHaveProperty('email');
  });

  it('ném NotFoundException nếu không tìm thấy khóa học công khai', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(404)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('không cho Admin tạo khóa học khi thiếu instructor_id', async () => {
    await expect(
      service.create(
        { title: 'Khóa mới', slug: 'khoa-moi' } as any,
        makeUser({ roles: ['Admin'] }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('tự gán instructor_id theo tài khoản Instructor đang đăng nhập', async () => {
    repository.save.mockImplementation(async (data) => data);

    await service.create(
      { title: 'Khóa mới', slug: 'khoa-moi', instructor_id: 999 } as any,
      makeUser({ sub: 10, roles: ['Instructor'] }),
    );

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ instructor_id: 10 }),
    );
  });

  it('không cho Instructor sửa khóa học của người khác', async () => {
    repository.findOne.mockResolvedValue(makeCourse({ instructor_id: 20 }));

    await expect(
      service.update(1, { title: 'Tên mới' } as any, makeUser({ sub: 10 })),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('cho phép Admin thao tác với khóa học của giảng viên khác', async () => {
    repository.findOne.mockResolvedValue(makeCourse({ instructor_id: 20 }));

    await service.remove(1, makeUser({ roles: ['Admin'] }));

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('chuyển lỗi slug trùng từ database thành ConflictException', async () => {
    repository.create.mockImplementation((data) => data);
    repository.save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

    await expect(
      service.create(
        { title: 'Trùng slug', slug: 'react-co-ban', instructor_id: 10 } as any,
        makeUser({ roles: ['Admin'], sub: 1 }),
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
