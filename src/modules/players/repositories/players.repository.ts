import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';
import { CreatePlayerDto } from '../dto/createPlayer.dto';
import { UpdatePlayerDto } from '../dto/updatePlayer.dto';
import { IPlayers } from '../models/player.model';
import { ValidateIdObject } from 'src/config/utils/ValidateIdObject';
import { ConvertTo_id } from 'src/config/utils/ConvertTo_id';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { BadRequestError } from 'src/common/errors/types/BadRequestError';

@Injectable()
export class PlayersRepository {
  constructor(@InjectModel('Players') private readonly playersModel: Model<IPlayers>) {}

  async findAll() {
    const players = await this.playersModel.find();
    if (players.length === 0) {
      throw new NotFoundError('Nenhum jogador encontrado');
    }

    return players;
  }

  async findById(id: string) {
    if (!ValidateIdObject(id)) {
      throw new BadRequestError('Formato de id inválido');
    }

    const _id = ConvertTo_id(id);
    const player = await this.playersModel.findById(_id);
    if (!player) {
      throw new NotFoundError('Jogador não encontrado');
    }

    return player;
  }

  async create(player: CreatePlayerDto) {
    const { name, email, phoneNumber, password, confirmPassword, ranking, positionRanking, urlPlayerPhoto } = player;

    const isExistEmail = await this.playersModel.findOne({ email });
    if (isExistEmail) {
      throw new BadRequestError('Email já cadastrado');
    }

    const isExistPhoneNumber = await this.playersModel.findOne({ phoneNumber });
    if (isExistPhoneNumber) {
      throw new BadRequestError('Número de telefone já cadastrado');
    }

    if (password !== confirmPassword) {
      throw new BadRequestError('Senhas não conferem');
    }

    const hashedPassword = await hash(password, 10);
    return await this.playersModel.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      ranking,
      positionRanking,
      urlPlayerPhoto,
    });
  }

  async update(id: string, player: UpdatePlayerDto) {
    if (!ValidateIdObject(id)) {
      throw new BadRequestError('Formato de id inválido');
    }

    const _id = ConvertTo_id(id);
    const { name, email, phoneNumber, password, confirmPassword, ranking, positionRanking, urlPlayerPhoto } = player;
    let newPassword = '';

    const playerToUpdate = await this.playersModel.findById(_id);
    if (!playerToUpdate) {
      throw new NotFoundError('Jogador não encontrado');
    }

    if (email) {
      const isExistEmail = await this.playersModel.findOne({ email });
      if (isExistEmail && isExistEmail._id.toString() !== _id.toString()) {
        throw new BadRequestError('Email já cadastrado');
      }
    }

    if (phoneNumber) {
      const isExistPhoneNumber = await this.playersModel.findOne({ phoneNumber });
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

      newPassword = await hash(password, 10);
    }

    playerToUpdate.name = name || playerToUpdate.name;
    playerToUpdate.email = email || playerToUpdate.email;
    playerToUpdate.phoneNumber = phoneNumber || playerToUpdate.phoneNumber;
    playerToUpdate.password = newPassword || playerToUpdate.password;
    playerToUpdate.ranking = ranking || playerToUpdate.ranking;
    playerToUpdate.positionRanking = positionRanking || playerToUpdate.positionRanking;
    playerToUpdate.urlPlayerPhoto = urlPlayerPhoto || playerToUpdate.urlPlayerPhoto;

    return await playerToUpdate.save();
  }

  async delete(id: string) {
    if (!ValidateIdObject(id)) {
      throw new BadRequestError('Formato de id inválido');
    }

    const _id = ConvertTo_id(id);
    const player = await this.playersModel.findById(_id);
    if (!player) {
      throw new NotFoundError('Jogador não encontrado');
    }

    return await player.remove();
  }
}
