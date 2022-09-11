import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class Result {
  @IsOptional()
  @IsString({ message: 'O tipo do campo set deve ser uma string' })
  readonly set: string;
}

export class LinkChallengeWithMatchDto {
  @IsNotEmpty({ message: 'Campo def é requerido' })
  @IsString({ message: 'O tipo do campo def deve ser uma string' })
  readonly def: string;

  @IsOptional()
  @IsArray({ message: 'O tipo do campo result deve ser um array' })
  @Type(() => Result)
  @ValidateNested({ each: true })
  readonly result: Result[];
}
