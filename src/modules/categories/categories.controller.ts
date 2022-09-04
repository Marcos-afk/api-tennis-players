import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async find(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();
    return res.status(HttpStatus.OK).json({ message: 'Lista de categorias!', categories });
  }

  @Get(':id')
  async findById(@Param() id: string, @Res() res: Response) {
    const category = await this.categoriesService.findById(id);
    return res.status(HttpStatus.OK).json({ message: 'Categoria encontrada!', category });
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: Response) {
    const category = await this.categoriesService.create(createCategoryDto);
    return res.status(HttpStatus.CREATED).json({ message: 'Categoria criada com sucesso!', category });
  }

  @Put(':id')
  async update(@Param() id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: Response) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return res.status(HttpStatus.OK).json({ message: 'Categoria atualizada com sucesso!', category });
  }

  @Delete(':id')
  async delete(@Param() id: string, @Res() res: Response) {
    const category = await this.categoriesService.delete(id);
    return res.status(HttpStatus.OK).json({ message: 'Categoria excluída com sucesso!', category });
  }
}
