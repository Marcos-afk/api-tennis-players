import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayersRepository } from './repositories/players.repository';
import PlayersSchema from './schema/players.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Players', schema: PlayersSchema }])],
  controllers: [PlayersController],
  providers: [PlayersService, PlayersRepository],
})
export class PlayersModule {}
