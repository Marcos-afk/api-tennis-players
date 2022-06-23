import { isValidObjectId } from 'mongoose';

export function ValidateIdObject(id: string) {
  if (isValidObjectId(id)) {
    return true;
  }

  return false;
}
