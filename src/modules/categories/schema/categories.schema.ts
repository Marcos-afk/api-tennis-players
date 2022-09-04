import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Players } from 'src/modules/players/schema/players.schema';

export type CategoriesDocument = Categories & Document;

class Events {
  @Prop()
  name?: string;

  @Prop()
  operation?: string;

  @Prop()
  value?: number;
}

@Schema({ timestamps: true })
export class Categories {
  @Prop({ required: true, unique: true })
  category: string;

  @Prop()
  description?: string;

  @Prop({ type: MongooseSchema.Types.Array })
  events?: Events[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Players.name }] })
  players?: string[];
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
