import { Body, Controller, HttpStatus, Get, Post, Res, Param, Put, Delete } from '@nestjs/common';
import { Response } from 'express';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { LinkChallengeWithMatchDto } from './dto/linkChallengeWithMatch.dto';
import { UpdateChallengeDto } from './dto/updateChallenge.dto';

@Controller('api/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async find(@Res() res: Response) {
    const challenges = await this.challengesService.findAll();
    return res.status(HttpStatus.OK).json({ message: 'Lista de desafios!', challenges });
  }

  @Get(':id')
  async findById(@Param() id: string, @Res() res: Response) {
    const challenge = await this.challengesService.findById(id);
    return res.status(HttpStatus.OK).json({ message: 'Desafio encontrado!', challenge });
  }

  @Get('player/:id')
  async findByPlayer(@Param() id: string, @Res() res: Response) {
    const challenges = await this.challengesService.findByPlayer(id);
    return res.status(HttpStatus.OK).json({ message: 'Lista de desafios!', challenges });
  }

  @Post()
  async create(@Body() createChallengesDto: CreateChallengeDto, @Res() res: Response) {
    const challenge = await this.challengesService.create(createChallengesDto);
    return res.status(HttpStatus.CREATED).json({ message: 'Desafio criado com sucesso!', challenge });
  }

  @Put(':id')
  async update(@Param() id: string, @Body() updateChallengeDto: UpdateChallengeDto, @Res() res: Response) {
    const challenge = await this.challengesService.update(id, updateChallengeDto);
    return res.status(HttpStatus.OK).json({ message: 'Desafio atualizado com sucesso!', challenge });
  }

  @Put('link-challenge-with-match/:id')
  async linkChallengeWithMatch(
    @Param() id: string,
    @Body() linkChallengeWithMatch: LinkChallengeWithMatchDto,
    @Res() res: Response,
  ) {
    const challenge = await this.challengesService.linkChallengeWithMatch(id, linkChallengeWithMatch);
    return res.status(HttpStatus.OK).json({ message: 'Desafio vinculado a partida com sucesso!', challenge });
  }

  @Delete(':id')
  async delete(@Param() id: string, @Res() res: Response) {
    const challenge = await this.challengesService.delete(id);
    return res.status(HttpStatus.OK).json({ message: 'Desafio cancelado com sucesso!', challenge });
  }
}
