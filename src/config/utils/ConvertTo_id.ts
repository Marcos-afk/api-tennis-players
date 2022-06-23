import { Types } from 'mongoose';

export function ConvertTo_id(id: string) {
  const newId = new Types.ObjectId(id);
  return newId;
}
