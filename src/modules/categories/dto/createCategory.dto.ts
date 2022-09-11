import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class Events {
  @IsNotEmpty({ message: 'Campo nome do evento é requerido' })
  @IsString({ message: 'O tipo do campo nome  deve ser string' })
  @MaxLength(50, { message: 'Limite de caracteres do campo nome acima do permitido(50)' })
  @MinLength(3, { message: 'Limite de caracteres do campo nome  abaixo do permitido(3)' })
  readonly name: string;

  @IsNotEmpty({ message: 'Campo operação do evento é requerido' })
  @IsString({ message: 'O tipo do campo operação  deve ser string' })
  @MaxLength(50, { message: 'Limite de caracteres do campo operação acima do permitido(50)' })
  @MinLength(3, { message: 'Limite de caracteres do campo operação  abaixo do permitido(3)' })
  readonly operation: string;

  @IsNotEmpty({ message: 'Campo valor do evento é requerido' })
  @IsNumber({}, { message: 'O tipo do campo valor  deve ser string' })
  readonly value: number;
}

export class CreateCategoryDto {
  @IsString({ message: 'O tipo do campo categoria  deve ser string' })
  @IsNotEmpty({ message: 'Campo categoria é requerido' })
  @MaxLength(50, { message: 'Limite de caracteres do campo categoria acima do permitido(50)' })
  @MinLength(3, { message: 'Limite de caracteres do campo categoria  abaixo do permitido(3)' })
  readonly category: string;

  @IsOptional()
  @IsString({ message: 'O tipo do campo descrição deve ser string' })
  @MaxLength(250, { message: 'Limite de caracteres do campo descrição acima do permitido(250)' })
  @MinLength(3, { message: 'Limite de caracteres do campo descrição abaixo do permitido(3)' })
  readonly description: string;

  @IsArray({ message: 'O tipo do campo eventos deve ser um array' })
  @ArrayMinSize(1, { message: 'É preciso ter pelo menos um evento' })
  @ValidateNested({ each: true })
  @Type(() => Events)
  events: Events[];

  @IsOptional()
  @IsArray({ message: 'O tipo do campo jogadores deve ser um array' })
  @IsString({ each: true })
  players: string[];
}
