import { compare, hash } from 'bcrypt';

export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

export const comparePassword = async (password: string, comparedPassword: string) => {
  return await compare(password, comparedPassword);
};
