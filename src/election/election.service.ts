import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Election, ElectionStatus } from './election.entity';

@Injectable()
export class ElectionService {
  constructor(
    @InjectRepository(Election)
    private electionRepository: Repository<Election>,
  ) {}

  async;
  createElection(electionData: any): Promise<Election> {
    const election = new Election();
    election.name = electionData.name;
    election.electionDate = electionData.electionDate;
    election.status = ElectionStatus.UPCOMING; // Assuming new elections are upcoming
    election.createdBy = electionData.createdBy; // Assuming createdBy is provided
    return this.electionRepository.save(election);
  }

  async findAll(status: ElectionStatus): Promise<Election[]> {
    return this.electionRepository.find({ where: { status } });
  }

  async findOne(id: number): Promise<Election | undefined | null> {
    return this.electionRepository.findOneBy({ id });
  }

  async updateElection(
    id: number,
    electionData: any,
  ): Promise<Election | undefined> {
    const election = await this.electionRepository.findOneBy({ id });
    if (election) {
      election.name = electionData.name || election.name;
      election.electionDate =
        electionData.electionDate || election.electionDate;
      election.status = electionData.status || election.status;
      return this.electionRepository.save(election);
    }
    return undefined;
  }

  async deleteElection(id: number): Promise<void> {
    await this.electionRepository.delete(id);
  }
}
