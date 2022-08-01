import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';
import { PlayersService } from './players.service';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const players = await this.playersService.findAll();
    return res.status(HttpStatus.OK).json({ message: 'Lista de jogadores', players });
  }

  @Get(':id')
  async findById(@Param() id: string, @Res() res: Response) {
    const player = await this.playersService.findById(id);
    return res.status(HttpStatus.OK).json({ message: 'Jogador encontrado!', player });
  }

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto, @Res() res: Response) {
    const player = await this.playersService.create(createPlayerDto);
    return res.status(HttpStatus.OK).json({ message: 'Jogador cadastrado com sucesso!', player });
  }

  @Put(':id')
  async update(@Param() id: string, @Body() updatePlayerDto: UpdatePlayerDto, @Res() res: Response) {
    const player = await this.playersService.update(id, updatePlayerDto);
    return res.status(HttpStatus.OK).json({ message: 'Jogador atualizado com sucesso!', player });
  }

  @Delete(':id')
  async delete(@Param() id: string, @Res() res: Response) {
    const player = await this.playersService.delete(id);
    return res.status(HttpStatus.OK).json({ message: 'Jogador excluído com sucesso!', player });
  }
}
