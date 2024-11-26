import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePollsDto, PollsStatus } from './dto/create-polls.dto';
import { PollsEntity } from './entities/polls.entity';
import { S3Service } from '../reports/s3.service';
import { UpdatePollsDto } from './dto/update-polls.dto';
import { PollsStatusDto } from './dto/polls-status.dto';

@Injectable()
export class PollsService {
    constructor(
        @InjectRepository(PollsEntity)
        private readonly pollsRepository: Repository<PollsEntity>,
        private s3Service: S3Service,
    ) {}

    async postResults(
        createPollsDto: CreatePollsDto,
        file: Express.Multer.File,
    ): Promise<PollsEntity> {
        if (!file) {
            throw new BadRequestException('Upload a file for evidence');
        }
        const fileUrl = await this.s3Service.uploadFile(
            file,
            file.buffer,
            'File',
        );



        return await this.pollsRepository.save({ ...createPollsDto, fileUrl });
    }

    async getResults(): Promise<PollsEntity[] | any[]> {
        return await this.pollsRepository.find({});
    }

    async getSingleResult(id: string): Promise<PollsEntity | any> {
        return await this.pollsRepository.findOne({
            where: { id },
        });
    }

    async updateSingleResult(
        id: string,
        updatePollsDto: UpdatePollsDto,
    ): Promise<PollsEntity | any> {
        const poll = await this.pollsRepository.findOne({
            where: { id },
        });

        return updatePollsDto;
    }

    async deleteSingleResult(id: string): Promise<PollsEntity | any> {
        return {};
    }

    async getResultsByTenanatId(id: string): Promise<PollsEntity[] | any[]> {
        const polls = await this.pollsRepository.find({
            where: { tenantId: id },
        });
        return polls;
    }

    async getResultsByAgentId(id: string): Promise<PollsEntity[] | any[]> {
        const polls = await this.pollsRepository.find({
            where: { userAltirevId: id },
        });
        return polls;
    }

    async updatePollStatus(
        id: string,
        updatePollsDto: PollsStatusDto,
    ): Promise<any> {
        const polls = await this.pollsRepository.findOne({
            where: { id },
        });
        if (!polls) {
            throw new BadRequestException('Not a valid election id');
        }

        if (updatePollsDto.confirm) {
            polls.status = PollsStatus.COMPLETED;
        } else {
            polls.status = PollsStatus.REJECTED;
        }

        return await this.pollsRepository.save(polls);
    }

    async voteCount(id: string): Promise<any> {
        if(!id){
            throw new BadRequestException('invalid id')
        }

       const results = await this.pollsRepository.find({
            where:{electionId: id},
            select: ['counts'],
        });

        if(!results){
            throw new BadRequestException('invalid id')
        }


        if (results.length === 1) {
            return results;
        }

        const partyVoteCounts = {};

        results.forEach((result) => {
            const counts = result.counts;
            for (const [party, votes] of Object.entries(counts)) {
                partyVoteCounts[party] =
                    (partyVoteCounts[party] || 0) + Number(votes);
            }
        });

        const resultArray = Object.entries(partyVoteCounts).map(
            ([partyName, partyVote]) => ({
                partyName: partyName.toUpperCase(),
                partyVote: Number(partyVote),
            }),
        );

        return resultArray;
    }
}
