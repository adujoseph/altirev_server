import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultsEntity } from '../entities/results.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Results } from '../../../../domain/results';
import { ResultsRepository } from '../../results.repository';
import { ResultsMapper } from '../mappers/results.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { LocationEntity } from '../../../../../election/entities/location.entity';
import { UserEntity } from '../../../../../users/persistence/entities/user.entity';

@Injectable()
export class ResultsRelationalRepository implements ResultsRepository {
    constructor(
        @InjectRepository(ResultsEntity)
        private readonly resultsRepository: Repository<ResultsEntity>,
        @InjectRepository(LocationEntity)
        private readonly locationRepository: Repository<LocationEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async create(data: Results): Promise<Results> {
        const persistenceModel = ResultsMapper.toPersistence(data);
        const newEntity = await this.resultsRepository.save(
            this.resultsRepository.create(persistenceModel),
        );
        return ResultsMapper.toDomain(newEntity);
    }

    async findAllWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }): Promise<Results[]> {
        console.log('=== Repository: findAllWithPagination called ===');
        const entities = await this.resultsRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });

        return entities.map((result) => ResultsMapper.toDomain(result));
    }

    async findById(id: Results['id']): Promise<NullableType<Results>> {
        console.log('=== Repository: findById called ===');
        const entity = await this.resultsRepository.findOne({
            where: { id },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });
        return entity ? ResultsMapper.toDomain(entity) : null;
    }

    async findByAgentAndElectionAndLocation(userAltirevId: Results['userAltirevId'],
        electionid: Results['election']['id'],
        locationid: Results['location']['id'],
    ): Promise<NullableType<Results>> {
        const entity = await this.resultsRepository.findOne({
            where: {
                userAltirevId: userAltirevId,
                election: { id: electionid },
                location: { id: locationid }
            }
        });
        return entity ? ResultsMapper.toDomain(entity) : null;
    }

    async findByStatusAndElectionAndLocation(
        status: Results['status'],
        electionid: Results['election']['id'],
        locationid: Results['location']['id'],
    ): Promise<NullableType<Results>>{
        const entity = await this.resultsRepository.findOne({
            where: {
                status: status,
                election: { id: electionid },
                location: { id: locationid }
            }
        });
        return entity ? ResultsMapper.toDomain(entity) : null;
    }




    async findByElection(
        electionId: Results['election']['id'],
    ): Promise<Results> {
        const entity = await this.resultsRepository.findOne({
            where: { election: { id: electionId } },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });

        if (!entity) {
            throw new Error('Result not found for election: ' + electionId);
        }

        return ResultsMapper.toDomain(entity);
    }

    async findByAgent(
        userAltirevId: Results['userAltirevId'],
    ): Promise<Results[]> {
        const entity = await this.resultsRepository.find({
            where: { userAltirevId },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });

        const resultList = entity.map((result) => {
            return ResultsMapper.toDomain(result);
        });
        return resultList ? resultList : [];
    }

    async findByTenantId(tenantId: Results['tenantId']): Promise<Results[]> {
        const entity = await this.resultsRepository.find({
            where: { tenantId },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });

        const resultList = entity.map((result) => {
            return ResultsMapper.toDomain(result);
        });
        return resultList ? resultList : [];
    }

    async update(
        id: Results['id'],
        payload: Partial<Results>,
    ): Promise<Results> {
        const entity = await this.resultsRepository.findOne({
            where: { id },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });

        if (!entity) {
            throw new Error('Record not found');
        }

        const updatedEntity = await this.resultsRepository.save(
            this.resultsRepository.create(
                ResultsMapper.toPersistence({
                    ...ResultsMapper.toDomain(entity),
                    ...payload,
                }),
            ),
        );

        return ResultsMapper.toDomain(updatedEntity);
    }

    async remove(id: Results['id']): Promise<void> {
        await this.resultsRepository.delete(id);
    }

    ////===================================================================
    async findByState(stateId: string): Promise<Results[]> {
        const entities = await this.resultsRepository.find({
            where: {
                location: {
                    state: { id: stateId }
                }
            },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });
        return entities.map(result => ResultsMapper.toDomain(result));
    }

    async findByLga(lgaId: string): Promise<Results[]> {
        const entities = await this.resultsRepository.find({
            where: {
                location: {
                    lga: { id: lgaId }
                }
            },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });
        return entities.map(result => ResultsMapper.toDomain(result));
    }

    async findByWard(wardId: string): Promise<Results[]> {
        const entities = await this.resultsRepository.find({
            where: {
                location: {
                    ward: { id: wardId }
                }
            },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });
        return entities.map(result => ResultsMapper.toDomain(result));
    }

    async findByPollingUnit(pollingUnitId: string): Promise<Results[]> {
        const entities = await this.resultsRepository.find({
            where: {
                location: {
                    pollingUnit: { id: pollingUnitId }
                }
            },
            relations: ['election', 'location', 'location.state', 'location.lga', 'location.ward', 'location.pollingUnit', 'tags'],
        });
        return entities.map(result => ResultsMapper.toDomain(result));
    }

    async findByLocation(filter: {
        electionId?: string;
        stateId?: string;
        lgaId?: string;
        wardId?: string;
        pollingUnitId?: string;
    }): Promise<Results[]> {
        console.log('=== Repository: findByLocation called ===');
        console.log('Filter:', filter);

        const queryBuilder = this.resultsRepository.createQueryBuilder('result')
            .leftJoinAndSelect('result.election', 'election')
            .leftJoinAndSelect('result.location', 'location')
            .leftJoinAndSelect('location.state', 'state')
            .leftJoinAndSelect('location.lga', 'lga')
            .leftJoinAndSelect('location.ward', 'ward')
            .leftJoinAndSelect('location.pollingUnit', 'pollingUnit')
            .leftJoinAndSelect('result.tags', 'tags');

        try {
            if (filter.electionId) {
                console.log('Adding election filter:', filter.electionId);
                queryBuilder.andWhere('election.id = :electionId', { electionId: filter.electionId });
            }
            if (filter.stateId) {
                console.log('Adding state filter:', filter.stateId);
                queryBuilder.andWhere('state.id = :stateId', { stateId: filter.stateId });
            }
            if (filter.lgaId) {
                console.log('Adding lga filter:', filter.lgaId);
                queryBuilder.andWhere('lga.id = :lgaId', { lgaId: filter.lgaId });
            }
            if (filter.wardId) {
                console.log('Adding ward filter:', filter.wardId);
                queryBuilder.andWhere('ward.id = :wardId', { wardId: filter.wardId });
            }
            if (filter.pollingUnitId) {
                console.log('Adding polling unit filter:', filter.pollingUnitId);
                queryBuilder.andWhere('pollingUnit.id = :pollingUnitId', { pollingUnitId: filter.pollingUnitId });
            }

            const sql = queryBuilder.getSql();
            const parameters = queryBuilder.getParameters();

            console.log('=== Query Details ===');
            console.log('SQL:', sql);
            console.log('Parameters:', parameters);

            const entities = await queryBuilder.getMany();
            console.log('Query executed successfully');
            console.log('Found entities:', entities.length);

            return entities.map(result => ResultsMapper.toDomain(result));
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }
}
