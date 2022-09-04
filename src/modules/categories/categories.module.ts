import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from '../players/players.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { Categories, CategoriesSchema } from './schema/categories.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }]), PlayersModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
