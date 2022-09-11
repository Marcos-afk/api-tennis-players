import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateChallengeDto {
  @IsNotEmpty({ message: 'Campo jogador é requerido' })
  @IsString({ message: 'O tipo do campo jogador deve ser uma string' })
  readonly requester: string;

  @IsArray({ message: 'O tipo do campo eventos deve ser um array' })
  @ArrayMinSize(2, { message: 'É preciso ter pelo dois um jogadores na partida' })
  @ArrayMaxSize(2, { message: 'Tamanho máximo de jogadores por partida atingido' })
  @IsString({ each: true })
  readonly players: string[];
}
