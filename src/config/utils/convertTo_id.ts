import { isValidObjectId, Types } from 'mongoose';

export const convertTo_id = (id: string) => {
  if (!isValidObjectId(id)) {
    return false;
  }

  const newId = new Types.ObjectId(id);
  return newId;
};
