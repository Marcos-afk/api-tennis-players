import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from '../categories/categories.module';
import { PlayersModule } from '../players/players.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengesRepository } from './repositories/challenges.repository';
import { Challenges, ChallengesSchema } from './schema/challenge.schema';
import { Matches, MatchesSchema } from './schema/matches.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenges.name, schema: ChallengesSchema },
      { name: Matches.name, schema: MatchesSchema },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesRepository, ChallengesService],
})
export class ChallengesModule {}
