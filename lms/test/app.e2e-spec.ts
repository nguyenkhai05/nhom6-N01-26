import { NotFoundException, ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';
import { AuthService } from '../src/auth/auth.service.js';
import { signToken } from '../src/auth/jwt.util.js';
import { CategoryService } from '../src/category/category.service.js';
import { CourseService } from '../src/course/course.service.js';

const TEST_JWT_SECRET = 'eduviet-e2e-test-secret-only';

const publishedCourse = {
  course_id: 1,
  instructor_id: 2,
  category_id: 1,
  title: 'React cơ bản',
  slug: 'react-co-ban',
  status: 'Published',
  instructor: { user_id: 2, full_name: 'Giảng viên thử nghiệm' },
  category: { category_id: 1, category_name: 'Frontend' },
};

const draftCourse = {
  course_id: 2,
  instructor_id: 2,
  category_id: 1,
  title: 'Khóa học bản nháp',
  slug: 'khoa-hoc-ban-nhap',
  status: 'Draft',
  instructor: { user_id: 2, full_name: 'Giảng viên thử nghiệm' },
  category: { category_id: 1, category_name: 'Frontend' },
};

const courseServiceMock = {
  findAll: vi.fn(async () => [publishedCourse]),
  findForManager: vi.fn(async () => [publishedCourse, draftCourse]),
  findOne: vi.fn(async (id: number) => {
    if (id === publishedCourse.course_id) return publishedCourse;
    throw new NotFoundException('Không tìm thấy khóa học');
  }),
  create: vi.fn(async (body: Record<string, unknown>, user: { sub: number; roles: string[] }) => ({
    ...body,
    instructor_id: user.roles.includes('Admin') ? body.instructor_id : user.sub,
  })),
  update: vi.fn(async () => publishedCourse),
  remove: vi.fn(async () => ({ deleted: true })),
};

const categoryServiceMock = {
  findAll: vi.fn(async () => [{ category_id: 1, category_name: 'Frontend' }]),
  findOne: vi.fn(async (id: number) =>
    id === 1 ? { category_id: 1, category_name: 'Frontend' } : null,
  ),
  create: vi.fn(async (body: Record<string, unknown>) => ({ category_id: 10, ...body })),
  update: vi.fn(async (id: number, body: Record<string, unknown>) =>
    id === 1 ? { category_id: 1, category_name: 'Frontend', ...body } : null,
  ),
  remove: vi.fn(async (id: number) => id === 1),
};

const authServiceMock = {
  register: vi.fn(async () => ({ message: 'register mock' })),
  login: vi.fn(async () => ({ message: 'login mock' })),
  me: vi.fn(async (userId: number) => ({
    user_id: userId,
    full_name: 'Người dùng E2E',
    email: 'e2e@example.com',
    roles: ['Student'],
  })),
};

function tokenFor(roles: string[], sub = 2): string {
  return signToken(
    { sub, email: 'e2e@example.com', roles },
    TEST_JWT_SECRET,
    60 * 60,
  );
}

describe('EduViet API (e2e)', () => {
  let app: INestApplication<App>;
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeAll(async () => {
    // Token dùng khóa bí mật riêng cho test; không dùng JWT_SECRET thật của dự án.
    process.env.JWT_SECRET = TEST_JWT_SECRET;

    const mockDataSource = {
      // Các service đã được mock; repository giả chỉ giúp khởi tạo provider của module.
      getRepository: vi.fn(() => ({})),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('DATA_SOURCE')
      .useValue(mockDataSource)
      .overrideProvider(CourseService)
      .useValue(courseServiceMock)
      .overrideProvider(CategoryService)
      .useValue(categoryServiceMock)
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    // Đăng ký cùng quy tắc validation được dùng trong main.ts.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  });

  it('GET / trả về thông điệp mặc định', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('GET /courses cho phép truy cập công khai và không trả email giảng viên', async () => {
    const response = await request(app.getHttpServer()).get('/courses').expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe('Published');
    expect(response.body[0].instructor).not.toHaveProperty('email');
  });

  it('GET /courses/:id trả 400 nếu id không phải số nguyên', async () => {
    await request(app.getHttpServer()).get('/courses/not-a-number').expect(400);
  });

  it('GET /courses/manage/all trả 401 nếu chưa đăng nhập', async () => {
    await request(app.getHttpServer()).get('/courses/manage/all').expect(401);
  });

  it('GET /courses/manage/all trả 403 nếu Student không đủ quyền', async () => {
    await request(app.getHttpServer())
      .get('/courses/manage/all')
      .set('Authorization', `Bearer ${tokenFor(['Student'], 7)}`)
      .expect(403);
  });

  it('GET /courses/manage/all cho phép Instructor có token hợp lệ', async () => {
    const response = await request(app.getHttpServer())
      .get('/courses/manage/all')
      .set('Authorization', `Bearer ${tokenFor(['Instructor'])}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
  });

  it('POST /courses trả 401 nếu chưa đăng nhập', async () => {
    await request(app.getHttpServer())
      .post('/courses')
      .send({ title: 'Khóa mới', slug: 'khoa-moi' })
      .expect(401);
  });

  it('POST /categories trả 401 nếu chưa đăng nhập', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ category_name: 'Testing' })
      .expect(401);
  });

  it('POST /categories trả 403 nếu Instructor không phải Admin', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${tokenFor(['Instructor'])}`)
      .send({ category_name: 'Testing' })
      .expect(403);
  });

  it('POST /categories cho phép Admin tạo danh mục', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${tokenFor(['Admin'], 1)}`)
      .send({ category_name: 'Testing' })
      .expect(201);

    expect(response.body.category_name).toBe('Testing');
  });

  it('ValidationPipe từ chối thuộc tính ngoài DTO', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${tokenFor(['Admin'], 1)}`)
      .send({ category_name: 'Testing', unknown_property: 'không được phép' })
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  it('GET /auth/me trả 401 nếu thiếu Bearer token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('GET /auth/me trả thông tin khi có token hợp lệ', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${tokenFor(['Student'], 7)}`)
      .expect(200);

    expect(response.body.user_id).toBe(7);
    expect(response.body.roles).toContain('Student');
  });
});
