import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoriesRepository } from './repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll() {
    return await this.categoriesRepository.findAll();
  }

  async findById(id: string) {
    return await this.categoriesRepository.findById(id);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.create(createCategoryDto);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesRepository.update(id, updateCategoryDto);
  }

  async delete(id: string) {
    return await this.categoriesRepository.delete(id);
  }
}
