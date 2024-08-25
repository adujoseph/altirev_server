import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Election, ElectionStatus } from './election.entity';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';

@Injectable()
export class ElectionService {
  constructor(
    @InjectRepository(Election)
    private electionRepository: Repository<Election>,
  ) {}

  async createElection(electionDto: CreateElectionDto): Promise<Election> {
    console.log({ electionDto });
    const electionData = await this.electionRepository.save(electionDto);
    return electionData;
  }

  async findAll(status: ElectionStatus): Promise<Election[]> {
    return await this.electionRepository.find({ where: { status } });
  }

  async findOne(id: string): Promise<Election | null> {
    return await this.electionRepository.findOneBy({ id });
  }

  async updateElection(
    id: string,
    electionData: UpdateElectionDto,
  ): Promise<Election | {}> {
    const election = await this.electionRepository.findOneBy({ id });
    if (election) {
      election.name = electionData.name || election.name;
      election.electionDate =
        electionData.electionDate || election.electionDate;
      election.status = electionData.status || election.status;
      return this.electionRepository.save(election);
    }

    let errorObject = {
      message: `No election with id ${id} exist`,
    };
    return errorObject;
  }

  async deleteElection(id: string): Promise<void> {
    await this.electionRepository.delete(id);
  }
}
