import {
  Body, Controller, Delete, Get,
  NotFoundException, Param, ParseIntPipe, Post, Put,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { Category } from './category.entity.js';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne(id);
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');
    return category;
  }

  @Post()
  createCategory(@Body() body: Partial<Category>) {
    return this.categoryService.create(body);
  }

  @Put(':id')
  async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Category>) {
    const updated = await this.categoryService.update(id, body);
    if (!updated) throw new NotFoundException('Không tìm thấy danh mục');
    return updated;
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.categoryService.remove(id);
    if (!deleted) throw new NotFoundException('Không tìm thấy danh mục');
    return { message: 'Xóa thành công' };
  }
}