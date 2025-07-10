import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePollsDto, PollsStatus } from './dto/create-polls.dto';
import { PollsEntity } from './entities/polls.entity';
import { S3Service } from '../reports/s3.service';
import { UpdatePollsDto } from './dto/update-polls.dto';
import { PollsStatusDto } from './dto/polls-status.dto';
import { ElectionService } from '../election/election.service';
import { ChangePollsStatusDto } from './dto/change-polls-status.dto';
import { Helpers } from '../utils/helper';

@Injectable()
export class PollsService {
    constructor(
        @InjectRepository(PollsEntity)
        private readonly pollsRepository: Repository<PollsEntity>,
        private s3Service: S3Service,
        @Inject(forwardRef(() => ElectionService))
        private electionService: ElectionService,
    ) { }

    async postResults(
        createPollsDto: CreatePollsDto,
        file: Express.Multer.File,
    ): Promise<PollsEntity | any> {
        if (!file) {
            throw new BadRequestException('Upload a file for evidence');
        }
        const fileUrl = await this.s3Service.uploadFile(
            file,
            file.buffer,
            'File',
        );

        const locationInfo = await this.electionService.getLocationByUser(createPollsDto.userAltirevId)

        if (!locationInfo) {
            throw new BadRequestException('No location for this user');
        }

        let result = new PollsEntity();
        result.accreditedVoters = createPollsDto.accreditedVoters;
        result.status = PollsStatus.PROCESSING;
        result.electionId = createPollsDto.electionId;
        result.userAltirevId = createPollsDto.userAltirevId;
        result.voteCasted = createPollsDto.voteCasted;
        result.counts = createPollsDto.counts;
        result.fileUrl = fileUrl;
        result.location = locationInfo;
        result.tenantId = createPollsDto.tenantId;
        result.locationId = createPollsDto.locationId;
        result.invalidVotes = createPollsDto.invalidVotes;
        return await this.pollsRepository.save(result);
    }

    async getResults(): Promise<PollsEntity[] | any[]> {
        const electionResults = await this.pollsRepository.find({});
        const sortedResults = electionResults.map(async (election) => {
            if (!election?.userAltirevId) {
                return { ...election, electionLocation: null };
            } else {
                const userLocation =
                    await this.electionService.getLocationByUser(
                        election?.userAltirevId,
                    );

                const electionName = await this.electionService.findOne(
                    election.electionId,
                );
                return {
                    ...election,
                    electionLocation: userLocation,
                    electionName,
                };
            }
        });
        return sortedResults;
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


        const sortedPolls = polls.map(async (election) => {
            if (!election?.userAltirevId) {
                return { ...election, electionLocation: null };
            } else {
                const userLocation =
                    await this.electionService.getLocationByUser(
                        election?.userAltirevId,
                    );

                const electionName = await this.electionService.findOne(
                    election.electionId,
                );
                return {
                    ...election,
                    electionLocation: userLocation,
                    electionName,
                };
            }
        });

        return sortedPolls;
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
        if (!id) {
            throw new BadRequestException('invalid id')
        }

        const results = await this.pollsRepository.find({
            where: { electionId: id },
            select: ['counts'],
        });

        const totalVotes = await this.pollsRepository.find({
            where: { electionId: id },
            select: ['voteCasted'],
        });

        const totalVotesCasted = totalVotes.reduce(
            (sum, poll) => sum + poll.voteCasted,
            0,
        );



        const invalidVotes = await this.pollsRepository.find({
            where: { electionId: id },
            select: ['invalidVotes'],
        });

        const totalInvalidVotes = invalidVotes.reduce(
            (sum, poll) => sum + poll.invalidVotes,
            0,
        );


        const accreditedVoters = await this.pollsRepository.find({
            where: { electionId: id },
            select: ['accreditedVoters'],
        });

        const totalAccreditedVoters = accreditedVoters.reduce(
            (sum, poll) => sum + poll.accreditedVoters,
            0,
        );


        if (!results) {
            throw new BadRequestException('invalid id')
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

        return { resultArray, totalAccreditedVoters, totalVotesCasted, totalInvalidVotes };
    }

    async changeStatus(id: string, statusDto: ChangePollsStatusDto) {
        if (!id) {
            throw new BadRequestException('Id not found');
        }
        let polls = await this.pollsRepository.findOneBy({ id });
        if (!polls) {
            throw new BadRequestException('Report does not exist');
        }
        polls.reasons = statusDto.reasons;
        polls.status = statusDto.status;
        polls.modifiedBy = statusDto.modifiedBy;

        return await this.pollsRepository.save(polls);
    }

    async findResultsByLocation(filter: {
        electionId?: string;
        stateId?: string;
        lgaId?: string;
        wardId?: string;
        pollingUnitId?: string;
    }) {
        console.log('Received filter parameters:', JSON.stringify(filter, null, 2));
        
        if (!filter.electionId) {
            throw new BadRequestException('Election ID is required');
        }
        
        // Create query builder
        const queryBuilder = this.pollsRepository
            .createQueryBuilder('poll')
            .leftJoinAndSelect('poll.location', 'location')
            .where('poll.electionId = :electionId', { electionId: filter.electionId });

        console.log('Base query:', queryBuilder.getSql());
        console.log('With parameters:', queryBuilder.getParameters());

        // Add location filters if they exist
        if (filter.stateId) {
            console.log('Adding state filter:', filter.stateId);
            queryBuilder.andWhere('location.stateId = :stateId', { stateId: filter.stateId });
        }
        if (filter.lgaId) {
            console.log('Adding LGA filter:', filter.lgaId);
            queryBuilder.andWhere('location.lgaId = :lgaId', { lgaId: filter.lgaId });
        }
        if (filter.wardId) {
            console.log('Adding ward filter:', filter.wardId);
            queryBuilder.andWhere('location.wardId = :wardId', { wardId: filter.wardId });
        }
        if (filter.pollingUnitId) {
            console.log('Adding polling unit filter:', filter.pollingUnitId);
            queryBuilder.andWhere('location.pollingUnitId = :pollingUnitId', { 
                pollingUnitId: filter.pollingUnitId 
            });
        }

        // Get the final SQL query
        const sql = queryBuilder.getSql();
        const params = queryBuilder.getParameters();
        console.log('Final SQL Query:', sql);
        console.log('Query Parameters:', params);

        // Execute the query
        const results = await queryBuilder.getMany();
        console.log('Query executed. Results found:', results.length);
        if (!results || results.length === 0) {
            return Helpers.failedHttpResponse(
                'No results found for the specified location',
                HttpStatus.NOT_FOUND,
            );
        }
        return Helpers.success(results);
    }

    // async getVoteCountsByLocation(filter: {
    //     electionId?: string;
    //     stateId?: string;
    //     lgaId?: string;
    //     wardId?: string;
    //     pollingUnitId?: string;
    // }): Promise<{ [key: string]: number }> {
    //     const results = await this.pollsRepository.find({filter});
    //     const voteCounts: { [key: string]: number } = {};

    //     results.forEach(result => {
    //         if (result.counts) {
    //             Object.entries(result.counts).forEach(([key, value]) => {
    //                 voteCounts[key] = (voteCounts[key] || 0) + Number(value);
    //             });
    //         }
    //     });

    //     return voteCounts;
    // }
}
