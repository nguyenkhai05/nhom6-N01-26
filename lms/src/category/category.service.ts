import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity.js';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: { parent: true, children: true },
      order: { order_index: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { category_id: id },
      relations: { parent: true, children: true, courses: true },
    });
  }

  async create(data: Partial<Category>): Promise<Category> {
    if (data.parent_id) {
      const parent = await this.categoryRepository.findOneBy({ category_id: data.parent_id });
      if (!parent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }
    }
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    const existing = await this.categoryRepository.findOneBy({ category_id: id });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    // Kiểm tra chu trình (Cycle Prevention) khi cập nhật parent_id
    if (data.parent_id !== undefined && data.parent_id !== null) {
      if (data.parent_id === id) {
        throw new BadRequestException('Danh mục không thể là cha của chính nó');
      }

      const targetParent = await this.categoryRepository.findOneBy({ category_id: data.parent_id });
      if (!targetParent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }

      // Duyệt ngược lên từ parent mới để phát hiện nếu đi qua chính `id`
      let currentParentId: number | null = targetParent.parent_id;
      const visited = new Set<number>([data.parent_id]);

      while (currentParentId) {
        if (currentParentId === id) {
          throw new BadRequestException('Không thể thiết lập danh mục cha tạo thành vòng lặp (chu trình)');
        }
        if (visited.has(currentParentId)) {
          break; // Đề phòng dữ liệu cũ đã có cycle
        }
        visited.add(currentParentId);

        const ancestor = await this.categoryRepository.findOneBy({ category_id: currentParentId });
        currentParentId = ancestor?.parent_id ?? null;
      }
    }

    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
      relations: { children: true, courses: true },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (category.children && category.children.length > 0) {
      throw new BadRequestException('Không thể xóa danh mục đang có danh mục con');
    }

    if (category.courses && category.courses.length > 0) {
      throw new BadRequestException('Không thể xóa danh mục đang gắn với các khóa học hiện hữu');
    }

    const result = await this.categoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
