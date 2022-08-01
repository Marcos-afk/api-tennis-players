import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from '../dto/createPlayer.dto';
import { UpdatePlayerDto } from '../dto/updatePlayer.dto';
import { convertTo_id } from 'src/modules/players/utils/convertTo_id';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';
import { Players, PlayersDocument } from '../schema/players.schema';
import { comparePassword, hashPassword } from '../utils/bcryptFunctions';

@Injectable()
export class PlayersRepository {
  constructor(@InjectModel(Players.name) private readonly playersModel: Model<PlayersDocument>) {}

  async findAll(): Promise<PlayersDocument[]> {
    const players = await this.playersModel.find();
    if (players.length === 0) {
      throw new NotFoundError('Nenhum jogador encontrado');
    }

    return players;
  }

  async findById(id: string): Promise<PlayersDocument> {
    const _id = convertTo_id(id);
    if (!_id) {
      throw new BadRequestError('Formato de id inválido');
    }

    const player = await this.playersModel.findById(_id);
    if (!player) {
      throw new NotFoundError('Jogador não encontrado');
    }

    return player;
  }

  async findByEmail(email: string): Promise<PlayersDocument | undefined> {
    return await this.playersModel.findOne({ email });
  }

  async findByPhone(phoneNumber: string): Promise<PlayersDocument | undefined> {
    return await this.playersModel.findOne({ phoneNumber: phoneNumber.replace(/\s/g, '') });
  }

  async create(player: CreatePlayerDto): Promise<PlayersDocument> {
    const { name, email, phoneNumber, password, confirmPassword, ranking, positionRanking, urlPlayerPhoto } = player;

    const isExistEmail = await this.findByEmail(email);
    if (isExistEmail) {
      throw new BadRequestError('Email já cadastrado');
    }

    const isExistPhoneNumber = await this.findByPhone(phoneNumber);
    if (isExistPhoneNumber) {
      throw new BadRequestError('Número de telefone já cadastrado');
    }

    if (password !== confirmPassword) {
      throw new BadRequestError('Senhas não conferem');
    }

    const hashedPassword = await hashPassword(password);
    return await this.playersModel.create({
      name,
      email,
      phoneNumber: phoneNumber.replace(/\s/g, ''),
      password: hashedPassword,
      ranking,
      positionRanking,
      urlPlayerPhoto,
    });
  }

  async update(id: string, player: UpdatePlayerDto): Promise<PlayersDocument> {
    const _id = convertTo_id(id);
    if (!_id) {
      throw new BadRequestError('Formato de id inválido');
    }

    const playerToUpdate = await this.findById(id);
    const { name, email, phoneNumber, password, confirmPassword, ranking, positionRanking, urlPlayerPhoto } = player;

    if (email) {
      const isExistEmail = await this.findByEmail(email);
      if (isExistEmail && isExistEmail._id.toString() !== _id.toString()) {
        throw new BadRequestError('Email já cadastrado');
      }
    }

    if (phoneNumber) {
      const isExistPhoneNumber = await this.findByPhone(phoneNumber);
      if (isExistPhoneNumber && isExistPhoneNumber._id.toString() !== _id.toString()) {
        throw new BadRequestError('Número de telefone já cadastrado');
      }
    }

    if (password) {
      if (!confirmPassword) {
        throw new BadRequestError('Confirmação da senha é requerida');
      }

      if (password !== confirmPassword) {
        throw new BadRequestError('Senhas não conferem');
      }

      const comparedPassword = await comparePassword(playerToUpdate.password, password);
      if (comparedPassword) {
        throw new BadRequestError('Senha nova não pode ser igual a antiga');
      }

      playerToUpdate.password = await hashPassword(password);
    }

    playerToUpdate.name = name || playerToUpdate.name;
    playerToUpdate.email = email || playerToUpdate.email;
    playerToUpdate.phoneNumber = phoneNumber?.replace(/\s/g, '') || playerToUpdate.phoneNumber;
    playerToUpdate.ranking = ranking || playerToUpdate.ranking;
    playerToUpdate.positionRanking = positionRanking || playerToUpdate.positionRanking;
    playerToUpdate.urlPlayerPhoto = urlPlayerPhoto || playerToUpdate.urlPlayerPhoto;

    return await playerToUpdate.save();
  }

  async delete(id: string): Promise<PlayersDocument> {
    const player = await this.findById(id);
    return await player.remove();
  }
}
