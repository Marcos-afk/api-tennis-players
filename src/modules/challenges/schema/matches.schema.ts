import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Categories } from 'src/modules/categories/schema/categories.schema';
import { Players } from 'src/modules/players/schema/players.schema';

export type MatchesDocument = Matches & Document;

class Result {
  @Prop()
  set: string;
}

@Schema({ timestamps: true })
export class Matches {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Categories.name })
  category: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Players.name, required: true }] })
  players: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Players.name, required: true })
  player: string;

  @Prop({ type: MongooseSchema.Types.Array })
  result: Result[];
}

export const MatchesSchema = SchemaFactory.createForClass(Matches);
