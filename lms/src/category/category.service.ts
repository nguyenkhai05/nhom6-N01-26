import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity.js';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ category_id: id });
  }

  create(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}