import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/createPlayer.dto';
import { UpdatePlayerDto } from './dto/updatePlayer.dto';
import { PlayersRepository } from './repositories/players.repository';

@Injectable()
export class PlayersService {
  constructor(private readonly repository: PlayersRepository) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async create(player: CreatePlayerDto) {
    return await this.repository.create(player);
  }

  async update(id: string, player: UpdatePlayerDto) {
    return await this.repository.update(id, player);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
}
