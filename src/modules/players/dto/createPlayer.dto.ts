import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString({ message: 'O tipo do campo nome  deve ser string' })
  @IsNotEmpty({ message: 'Campo nome é requerido' })
  @MaxLength(50, { message: 'Limite de caracteres do campo nome acima do permitido(50)' })
  @MinLength(3, { message: 'Limite de caracteres do campo nome  abaixo do permitido(3)' })
  readonly name: string;

  @IsNotEmpty({ message: 'Campo email é requerido' })
  @IsEmail({}, { message: 'Formato de email inválido' })
  readonly email: string;

  @IsString({ message: 'O tipo do campo senha deve ser string' })
  @IsNotEmpty({ message: 'Campo senha é requerido' })
  @MaxLength(10, { message: 'Limite de caracteres do campo senha acima do permitido(10)' })
  @MinLength(8, { message: 'Limite de caracteres do campo senha abaixo do permitido(8)' })
  readonly password: string;

  @IsString({ message: 'O tipo do campo confirmação de senha deve ser string' })
  @IsNotEmpty({ message: 'Campo confirmação de senha é requerido' })
  readonly confirmPassword: string;

  @IsNotEmpty({ message: 'Campo número de telefone é requerido' })
  @IsPhoneNumber('BR', { message: 'Formato de número de telefone inválido' })
  readonly phoneNumber: string;

  @IsOptional()
  @IsString({ message: 'O tipo do campo ranking deve ser string' })
  @MaxLength(1, { message: 'Limite de caracteres do campo ranking acima do permitido(1)' })
  readonly ranking: string;

  @IsOptional()
  @IsNumber({}, { message: 'O tipo do campo posição de ranking deve ser número' })
  readonly positionRanking: number;

  @IsOptional()
  @IsString({ message: 'O tipo do campo url da foto de perfil deve ser string' })
  readonly urlPlayerPhoto: string;
}
