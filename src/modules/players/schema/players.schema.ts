import { Schema } from 'mongoose';

const PlayersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    ranking: { type: String, default: 'D' },
    positionRanking: { type: Number, default: 0 },
    urlPlayerPhoto: { type: String },
  },
  { timestamps: true },
);

export default PlayersSchema;
