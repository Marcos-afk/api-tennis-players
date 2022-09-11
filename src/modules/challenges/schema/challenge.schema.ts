import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Categories } from 'src/modules/categories/schema/categories.schema';
import { Players } from 'src/modules/players/schema/players.schema';
import { Matches } from './matches.schema';

export type ChallengesDocument = Challenges & Document;

@Schema({ timestamps: true })
export class Challenges {
  @Prop()
  challengeTime: Date;

  @Prop()
  status: string;

  @Prop()
  requestTime: Date;

  @Prop()
  responseTime: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Categories.name })
  category: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Players.name })
  requester: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Players.name }] })
  players: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Matches.name })
  match: string;
}

export const ChallengesSchema = SchemaFactory.createForClass(Challenges);
