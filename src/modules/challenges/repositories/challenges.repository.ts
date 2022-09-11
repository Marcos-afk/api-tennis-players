import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { convertTo_id } from 'src/config/utils/convertTo_id';
import { CategoriesRepository } from 'src/modules/categories/repositories/categories.repository';
import { PlayersRepository } from 'src/modules/players/repositories/players.repository';
import { CreateChallengeDto } from '../dto/createChallenge.dto';
import { LinkChallengeWithMatchDto } from '../dto/linkChallengeWithMatch.dto';
import { UpdateChallengeDto } from '../dto/updateChallenge.dto';
import { Challenges, ChallengesDocument } from '../schema/challenge.schema';
import { Matches, MatchesDocument } from '../schema/matches.schema';
import { statusValues } from '../utils/status';

@Injectable()
export class ChallengesRepository {
  constructor(
    @InjectModel(Matches.name) private readonly matchesModel: Model<MatchesDocument>,
    @InjectModel(Challenges.name) private readonly challengesModel: Model<ChallengesDocument>,
    private readonly playersRepository: PlayersRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async findAll(): Promise<ChallengesDocument[]> {
    const challenges = await this.challengesModel
      .find()
      .populate({ path: 'players', select: ['name', 'email', 'ranking', 'positionRanking'] })
      .populate({ path: 'requester', select: ['name', 'email'] })
      .populate({ path: 'category', select: 'category' })
      .populate({ path: 'match', select: 'result' });

    if (challenges.length === 0) {
      throw new NotFoundError('Lista de desafios vazia');
    }

    return challenges;
  }

  async findById(id: string): Promise<ChallengesDocument> {
    const _id = convertTo_id(id);
    if (!_id) {
      throw new BadRequestError('Formato de id de desafio inválido!');
    }

    const challenge = await this.challengesModel.findById(_id);
    if (!challenge) {
      throw new NotFoundError('Desafio não encontrado');
    }

    return challenge;
  }

  async findByPlayer(id: string): Promise<ChallengesDocument[]> {
    const _id = convertTo_id(id);
    if (!_id) {
      throw new BadRequestError('Formato de id de usuário inválido!');
    }

    const player = await this.challengesModel
      .find({ requester: _id })
      .populate({ path: 'players', select: ['name', 'email', 'ranking', 'positionRanking'] })
      .populate({ path: 'requester', select: ['name', 'email'] })
      .populate({ path: 'category', select: 'category' })
      .populate({ path: 'match', select: 'result' });

    if (!player) {
      throw new NotFoundError('Jogador não encontrado');
    }

    return player;
  }

  async create({ players, requester }: CreateChallengeDto): Promise<ChallengesDocument> {
    for (const [, value] of players.entries()) {
      await this.playersRepository.findById(value);
    }

    const filteredPlayer = players.filter(item => item === requester);
    if (filteredPlayer.length === 0) {
      throw new BadRequestError('O solicitante deve ser um jogador da partida');
    }

    const category = await this.categoriesRepository.findCategoryByPlayer(requester);
    if (!category) {
      throw new BadRequestError('O solicitante deve estar em uma categoria');
    }

    return await this.challengesModel.create({
      status: 'PENDENTE',
      category: category._id,
      challengeTime: new Date(),
      requestTime: new Date(),
      players,
      requester,
    });
  }

  async update(id: string, { status }: UpdateChallengeDto): Promise<ChallengesDocument> {
    const challengeToUpdate = await this.findById(id);

    if (status) {
      if (!statusValues.includes(status)) {
        throw new BadRequestError('Status inválido');
      }

      challengeToUpdate.responseTime = new Date();
    }

    challengeToUpdate.status = status || challengeToUpdate.status;
    challengeToUpdate.challengeTime = new Date();

    return await challengeToUpdate.save();
  }

  async linkChallengeWithMatch(id: string, { result, def }: LinkChallengeWithMatchDto): Promise<ChallengesDocument> {
    const challenge = await this.findById(id);

    const filteredPlayer = challenge.players.filter(item => item.toString() === def);
    if (filteredPlayer.length === 0) {
      throw new BadRequestError('O jogador vencedor não faz parte da partida');
    }

    const match = await this.matchesModel.create({
      player: def,
      players: challenge.players,
      category: challenge.category,
      result: result,
    });

    if (!match) {
      throw new BadRequestError('Erro ao criar partida');
    }

    challenge.match = match._id;
    challenge.status = 'REALIZADO';

    try {
      await challenge.save();
    } catch {
      await this.matchesModel.deleteOne({ _id: match._id });
      throw new BadRequestError('Erro ao vincular desafio a partida');
    }

    return challenge;
  }

  async delete(id: string): Promise<ChallengesDocument> {
    const challenge = await this.findById(id);
    challenge.status = 'CANCELADO';

    return await challenge.save();
  }
}
