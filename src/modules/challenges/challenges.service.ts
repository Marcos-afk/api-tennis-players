import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { LinkChallengeWithMatchDto } from './dto/linkChallengeWithMatch.dto';
import { UpdateChallengeDto } from './dto/updateChallenge.dto';
import { ChallengesRepository } from './repositories/challenges.repository';

@Injectable()
export class ChallengesService {
  constructor(private readonly challengesRepository: ChallengesRepository) {}

  async findAll() {
    return await this.challengesRepository.findAll();
  }

  async findById(id: string) {
    return await this.challengesRepository.findById(id);
  }

  async findByPlayer(id: string) {
    return await this.challengesRepository.findByPlayer(id);
  }

  async create(createChallengeDto: CreateChallengeDto) {
    return await this.challengesRepository.create(createChallengeDto);
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    return await this.challengesRepository.update(id, updateChallengeDto);
  }

  async linkChallengeWithMatch(id: string, linkChallengeWithMatchDto: LinkChallengeWithMatchDto) {
    return await this.challengesRepository.linkChallengeWithMatch(id, linkChallengeWithMatchDto);
  }

  async delete(id: string) {
    return await this.challengesRepository.delete(id);
  }
}
