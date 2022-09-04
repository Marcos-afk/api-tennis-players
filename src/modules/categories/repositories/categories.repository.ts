import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { convertTo_id } from 'src/config/utils/convertTo_id';
import { PlayersRepository } from 'src/modules/players/repositories/players.repository';
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';
import { Categories, CategoriesDocument } from '../schema/categories.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Categories.name) private readonly categoriesModel: Model<CategoriesDocument>,
    private readonly playersRepository: PlayersRepository,
  ) {}

  async findAll(): Promise<CategoriesDocument[]> {
    const categories = await this.categoriesModel
      .find()
      .populate({ path: 'players', select: ['name', 'email', 'ranking', 'positionRanking'] });

    if (categories.length === 0) {
      throw new NotFoundError('Lista de categorias vazia.');
    }

    return categories;
  }

  async findById(id: string): Promise<CategoriesDocument> {
    const _id = convertTo_id(id);
    if (!_id) {
      throw new BadRequestError('Formato de id de categoria inválido!');
    }

    const category = await this.categoriesModel.findById(_id).populate({
      path: 'players',
      select: ['name', 'email', 'ranking', 'positionRanking'],
    });

    if (!category) {
      throw new BadRequestError('Categoria não encontrada !');
    }

    return category;
  }

  private async findByCategory(category: string): Promise<CategoriesDocument | undefined> {
    return await this.categoriesModel.findOne({ category });
  }

  async create({ category, description, events, players }: CreateCategoryDto): Promise<CategoriesDocument> {
    const isExistCategory = await this.findByCategory(category);
    if (isExistCategory) {
      throw new BadRequestError('Categoria já existe!');
    }

    if (players && players.length > 0) {
      for (const [, value] of players.entries()) {
        await this.playersRepository.findById(value);
      }
    }

    return await this.categoriesModel.create({
      category,
      description,
      events,
      players,
    });
  }

  async update(id: string, { category, description, events, players }: UpdateCategoryDto): Promise<CategoriesDocument> {
    const categoryToUpdate = await this.findById(id);

    if (category) {
      const isExistCategory = await this.findByCategory(category);
      if (isExistCategory && isExistCategory._id.toString() !== categoryToUpdate._id.toString()) {
        throw new BadRequestError('Categoria já existe!');
      }
    }

    if (players && players.length > 0) {
      for (const [, value] of players.entries()) {
        await this.playersRepository.findById(value);
      }
    }

    categoryToUpdate.category = category || categoryToUpdate.category;
    categoryToUpdate.description = description || categoryToUpdate.description;
    categoryToUpdate.events = events || categoryToUpdate.events;
    categoryToUpdate.players = players || categoryToUpdate.players;

    return await categoryToUpdate.save();
  }

  async delete(id: string) {
    const category = await this.findById(id);
    return await category.remove();
  }
}
