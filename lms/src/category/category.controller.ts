import {
  Body, Controller, Delete, Get,
  NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCategoryDto) {
    const updated = await this.categoryService.update(id, body);
    if (!updated) throw new NotFoundException('Không tìm thấy danh mục');
    return updated;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.categoryService.remove(id);
    if (!deleted) throw new NotFoundException('Không tìm thấy danh mục');
    return { message: 'Xóa thành công' };
  }
}