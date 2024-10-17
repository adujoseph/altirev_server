import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ElectionResultsEntity,
    ResultStatus,
} from './entities/election-results.entity';
import { Repository } from 'typeorm';
import { CreateElectionResultsDto } from './dto/ceate-election-result.dto';
import { ElectionService } from '../election/election.service';
import { UsersService } from '../users/users.service';
import { UpdateElectionResultDto } from './dto/update-election-result.dto';
import { ElectionResultStatusDto } from './dto/election-result-status.dto';

@Injectable()
export class ElectionResultsService {
    constructor(
        // private readonly resultsRepository: ResultsRepository,
        // @InjectRepository(CountryEntity)
        // private countryRepository: Repository<CountryEntity>,
        // @InjectRepository(StateEntity)
        // private stateRepository: Repository<StateEntity>,
        // @InjectRepository(LgaEntity)
        // private lgaRepository: Repository<LgaEntity>,
        // @InjectRepository(WardEntity)
        // private wardRepository: Repository<WardEntity>,
        // @InjectRepository(PollingEntity)
        // private pollingRepository: Repository<PollingEntity>,
        private readonly userService: UsersService,
        // private s3Service: S3Service,
        @Inject(forwardRef(() => ElectionService))
        private electionService: ElectionService,
        // private tagService: TagsService,
        @InjectRepository(ElectionResultsEntity)
        private electionResultRepository: Repository<ElectionResultsEntity>,
    ) {}
    async postResult(
        resultDto: CreateElectionResultsDto,
    ): Promise<ElectionResultsEntity> {
        if (!resultDto.fileUrl) {
            throw new BadRequestException('Upload a file for evidence');
        }

        const user = await this.userService.findByAltirevId(
            resultDto.userAltirevId,
        );
        if (!user) {
            throw new UnauthorizedException('User with Altirev ID not found');
        }

        const election = await this.electionService.findOne(
            resultDto.electionId,
        );

        if (!election) {
            throw new NotFoundException('Election not found');
        }

        // if (election.status !== ElectionStatus.ONGOING) {
        //     throw new ForbiddenException('Election is not ongoing');
        // }

        const locationInfo = await this.electionService.getLocationByUser(
            user.altirevId,
        );
        if (!locationInfo) {
            throw new ForbiddenException(
                'You are not Assigned to an Election Location',
            );
        }

        let result = new ElectionResultsEntity();
        result.accreditedVoters = resultDto.accreditedVoters;
        result.status = ResultStatus.PROCESSING;
        result.election = election;
        result.userAltirevId = resultDto.userAltirevId;
        result.voteCasted = resultDto.voteCasted;
        result.counts = resultDto.counts;
        result.fileUrl = resultDto.fileUrl;
        result.location = locationInfo;
        result.tenantId = user.tenantId;
        result.locationId = resultDto.locationId;
        console.log(result, resultDto.locationId);
        //const result = this.electionResultRepository.create(resultDto);
        return await this.electionResultRepository.save(result);
    }

    async getAllResults() {
        const electionResults = await this.electionResultRepository.find({});
        const sortedResults = electionResults.map(async (election) => {
            if (!election?.userAltirevId) {
                return { ...election, electionLocation: null };
            } else {
                const userLocation =
                    await this.electionService.getLocationByUser(
                        election?.userAltirevId,
                    );
                return { ...election, electionLocation: userLocation };
            }
        });

        console.log(electionResults);
        return sortedResults;
    }

    async getAgentResults(id: string): Promise<ElectionResultsEntity[]> {
        if (!id) {
            throw new ForbiddenException('Invalid User ID');
        }
        return await this.electionResultRepository.find({
            where: { userAltirevId: id },
        });
    }

    async getTenantResults(id: string): Promise<ElectionResultsEntity[]> {
        if (!id) {
            throw new ForbiddenException('Invalid tenant ID');
        }
        return await this.electionResultRepository.find({
            where: { tenantId: id },
        });
    }

    async updateElectionResult(
        id: string,
        updateResult: UpdateElectionResultDto,
    ): Promise<ElectionResultsEntity> {
        if (!id) {
            throw new ForbiddenException('Invalid ID');
        }
        const result = await this.electionResultRepository.findOneBy({ id });
        if (!result) {
            throw new ForbiddenException('Invalid election ID');
        }
        result.videoUrl = updateResult.videoUrl;
        result.status = ResultStatus.PENDING;
        return await this.electionResultRepository.save(result);
    }

    async updateResultStatus(
        id: string,
        resultStatus: ElectionResultStatusDto,
    ): Promise<ElectionResultsEntity> {
        if (!id) {
            throw new ForbiddenException('Invalid ID');
        }
        const result = await this.electionResultRepository.findOneBy({ id });
        if (!result) {
            throw new ForbiddenException('Invalid election ID');
        }
        if (resultStatus.confirm) {
            result.status = ResultStatus.COMPLETED;
        } else {
            result.status = ResultStatus.REJECTED;
        }
        return await this.electionResultRepository.save(result);
    }

    async getAggregateResults(
        stateId,
        localGovernmentId,
        pollingUnitId,
    ): Promise<ElectionResultsEntity[]> {
        const query = this.electionResultRepository
            .createQueryBuilder('result')
            .select('counts.partyId', 'partyId')
            .addSelect('SUM(counts.votes)', 'totalVotes')
            .groupBy('counts.partyId');

        if (pollingUnitId) {
            query.where('result.pollingUnitId = :pollingUnitId', {
                pollingUnitId,
            });
        } else if (localGovernmentId) {
            query
                .innerJoin('result.pollingUnit', 'pollingUnit')
                .innerJoin('pollingUnit.ward', 'ward')
                .innerJoin('ward.localGovernment', 'localGovernment')
                .andWhere('localGovernment.id = :localGovernmentId', {
                    localGovernmentId,
                });
        } else if (stateId) {
            query
                .innerJoin('result.pollingUnit', 'pollingUnit')
                .innerJoin('pollingUnit.ward', 'ward')
                .innerJoin('ward.localGovernment', 'localGovernment')
                .innerJoin('localGovernment.state', 'state')
                .andWhere('state.id = :stateId', { stateId });
        }

        const results = await query.getRawMany();
        return results;
    }

    async getAggregatedVotes(
        electionId: string,
        locationFilter: {
            stateId?: string;
            localGovernmentId?: string;
            wardId?: string;
            pollingUnitId?: string;
        },
    ): Promise<any> {
        if (!electionId) {
            throw new BadRequestException('Election Id not valid');
        }
        const queryBuilder = this.electionResultRepository
            .createQueryBuilder('result')
            .leftJoinAndSelect('result.location', 'location')
            .select(['result.counts', 'result.electionId'])
            .where('result.electionId = :electionId', { electionId });

        if (locationFilter.stateId) {
            queryBuilder.andWhere('location.stateId = :stateId', {
                stateId: locationFilter.stateId,
            });
        }
        if (locationFilter.localGovernmentId) {
            queryBuilder.andWhere('location.lgId = :lgId', {
                lgId: locationFilter.localGovernmentId,
            });
        }
        if (locationFilter.wardId) {
            queryBuilder.andWhere('location.wardId = :wardId', {
                wardId: locationFilter.wardId,
            });
        }
        if (locationFilter.pollingUnitId) {
            queryBuilder.andWhere('location.pollingUnitId = :pollingUnitId', {
                pollingUnitId: locationFilter.pollingUnitId,
            });
        }

        const results = await queryBuilder.getMany();

        const partyVoteCounts = {};

        results.forEach((result) => {
            const counts = result.counts;

            if (counts && typeof counts === 'object') {
                for (const [party, votes] of Object.entries(counts)) {
                    partyVoteCounts[party] =
                        (partyVoteCounts[party] || 0) + Number(votes);
                }
            } else {
                console.warn(`Invalid counts data for result: ${result.id}`);
            }
        });

        return {
            electionId,
            partyVoteCounts,
        };
    }

    async getAggregatedVotes2(
        electionId: string,
        locationFilter: {
            stateId?: string;
            localGovernmentId?: string;
            wardId?: string;
            pollingUnitId?: string;
        },
    ) {
        if (!electionId) {
            throw new BadRequestException('Election Id not valid');
        }

        // const where: any = { electionId };
        const where: any = { electionId, status: ResultStatus.COMPLETED };

        if (locationFilter.stateId) {
            where['location.stateId'] = locationFilter.stateId;
        }
        if (locationFilter.localGovernmentId) {
            where['location.localGovernmentId'] =
                locationFilter.localGovernmentId;
        }
        if (locationFilter.wardId) {
            where['location.wardId'] = locationFilter.wardId;
        }
        if (locationFilter.pollingUnitId) {
            where['location.pollingUnitId'] = locationFilter.pollingUnitId;
        }

        const results = await this.electionResultRepository.find({
            where,
            select: ['counts'],
        });

        if (results.length === 0) {
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
