import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Election, ElectionStatus } from './election.entity';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { GetElectionsFilterDto } from './dto/get-election.dto';

@Injectable()
export class ElectionService {
    constructor(
        @InjectRepository(Election)
        private electionRepository: Repository<Election>,
    ) {}

    async createElection(electionDto: CreateElectionDto): Promise<Election> {
        const electionDate = new Date(electionDto.electionDate);
        const currentDate = new Date();
        if (electionDate < currentDate) {
            electionDto.status = ElectionStatus.PREVIOUS;
        } else if (electionDate.toDateString() === currentDate.toDateString()) {
            electionDto.status = ElectionStatus.ONGOING;
        } else {
            electionDto.status = ElectionStatus.UPCOMING;
        }
        const electionData = await this.electionRepository.save(electionDto);
        return electionData;
    }

    async findAll(status: ElectionStatus): Promise<Election[]> {
        const currentDate = new Date();
        if(status){
            return await this.electionRepository.find({ where: { status } });
        }
        return await this.electionRepository.find()   
    }


    async getAllElections(filterDto: GetElectionsFilterDto): Promise<Election[]> {
        const { status, search, page = 1, limit = 10, sortField = 'date', sortDirection = 'ASC' } = filterDto;

        const query = this.electionRepository.createQueryBuilder('election');

        // Apply filtering by status
        if (status) {
            query.andWhere('election.status = :status', { status });
        }

        // Apply search functionality
        if (search) {
            query.andWhere(
                '(election.name LIKE :search OR election.description LIKE :search)',
                { search: `%${search}%` },
            );
        }

        // Apply sorting
        query.orderBy(`election.${sortField}`, sortDirection);

        // Apply pagination
        query.skip((page - 1) * limit).take(limit);

        const elections = await query.getMany();
        return elections;
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
