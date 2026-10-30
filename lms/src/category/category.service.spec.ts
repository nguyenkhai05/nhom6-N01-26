import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { CategoryService } from './category.service.js';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = {
      find: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => ({ category_id: 1, ...data })),
      update: vi.fn(async () => ({ affected: 1 })),
      delete: vi.fn(async () => ({ affected: 1 })),
    };
    service = new CategoryService(repository as unknown as Repository<Category>);
  });

  it('trả về danh sách danh mục từ repository', async () => {
    const categories = [{ category_id: 1, category_name: 'Frontend' }];
    repository.find.mockResolvedValue(categories);

    await expect(service.findAll()).resolves.toEqual(categories);
    expect(repository.find).toHaveBeenCalledOnce();
  });

  it('tìm danh mục theo id', async () => {
    const category = { category_id: 2, category_name: 'Backend' };
    repository.findOne.mockResolvedValue(category);

    await expect(service.findOne(2)).resolves.toEqual(category);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { category_id: 2 },
      relations: { parent: true, children: true, courses: true },
    });
  });

  it('tạo và lưu danh mục mới', async () => {
    const input = { category_name: 'DevOps', order_index: 3 };
    await service.create(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(repository.save).toHaveBeenCalledWith(input);
  });

  it('cập nhật danh mục rồi đọc lại dữ liệu', async () => {
    repository.findOneBy.mockResolvedValue({ category_id: 1, category_name: 'Frontend' });
    repository.findOne.mockResolvedValue({ category_id: 1, category_name: 'Frontend nâng cao' });

    const result = await service.update(1, { category_name: 'Frontend nâng cao' });

    expect(repository.update).toHaveBeenCalledWith(1, { category_name: 'Frontend nâng cao' });
    expect(result).toMatchObject({ category_id: 1, category_name: 'Frontend nâng cao' });
  });

  it('ngăn chặn chu trình khi danh mục tự nhận mình làm cha (parent_id === id)', async () => {
    repository.findOneBy.mockResolvedValue({ category_id: 1, category_name: 'Frontend' });

    await expect(service.update(1, { parent_id: 1 })).rejects.toThrow(BadRequestException);
  });

  it('ngăn chặn chu trình gián tiếp giữa 2 danh mục (A -> B -> A)', async () => {
    // Giả sử category 2 có parent_id là 1
    repository.findOneBy.mockImplementation(async ({ category_id }) => {
      if (category_id === 1) return { category_id: 1, parent_id: null };
      if (category_id === 2) return { category_id: 2, parent_id: 1 };
      return null;
    });

    // Thử cập nhật category 1 nhận category 2 làm cha -> tạo vòng lặp
    await expect(service.update(1, { parent_id: 2 })).rejects.toThrow(
      'Không thể thiết lập danh mục cha tạo thành vòng lặp (chu trình)',
    );
  });

  it('trả về true khi xóa thành công danh mục không có ràng buộc', async () => {
    repository.findOne.mockResolvedValue({ category_id: 1, children: [], courses: [] });
    repository.delete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.toBe(true);
  });

  it('từ chối xóa danh mục khi còn danh mục con', async () => {
    repository.findOne.mockResolvedValue({
      category_id: 1,
      children: [{ category_id: 2, category_name: 'ReactJS' }],
      courses: [],
    });

    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });
});
