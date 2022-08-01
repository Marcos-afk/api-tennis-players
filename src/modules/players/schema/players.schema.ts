import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayersDocument = Players & Document;

@Schema()
export class Players {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ default: 'D' })
  ranking?: string;

  @Prop({ default: 0 })
  positionRanking?: number;

  @Prop()
  urlPlayerPhoto?: string;
}

export const PlayersSchema = SchemaFactory.createForClass(Players);
