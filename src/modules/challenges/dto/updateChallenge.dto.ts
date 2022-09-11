import { IsOptional, IsString } from 'class-validator';

export class UpdateChallengeDto {
  @IsOptional()
  @IsString({ message: 'Tipo do campo status deve ser uma string' })
  status: string;
}
