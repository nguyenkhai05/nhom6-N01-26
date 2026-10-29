import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { CategoryService } from './category.service.js';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = {
      find: vi.fn(),
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
    repository.findOneBy.mockResolvedValue(category);

    await expect(service.findOne(2)).resolves.toEqual(category);
    expect(repository.findOneBy).toHaveBeenCalledWith({ category_id: 2 });
  });

  it('tạo và lưu danh mục mới', async () => {
    const input = { category_name: 'DevOps', order_index: 3 };
    await service.create(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(repository.save).toHaveBeenCalledWith(input);
  });

  it('cập nhật danh mục rồi đọc lại dữ liệu', async () => {
    repository.findOneBy.mockResolvedValue({ category_id: 1, category_name: 'Frontend nâng cao' });

    const result = await service.update(1, { category_name: 'Frontend nâng cao' });

    expect(repository.update).toHaveBeenCalledWith(1, { category_name: 'Frontend nâng cao' });
    expect(result).toMatchObject({ category_id: 1, category_name: 'Frontend nâng cao' });
  });

  it('trả về true khi xóa được danh mục', async () => {
    repository.delete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.toBe(true);
  });

  it('trả về false khi id cần xóa không tồn tại', async () => {
    repository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(404)).resolves.toBe(false);
  });
});
