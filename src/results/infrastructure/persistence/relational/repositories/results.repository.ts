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
        const entities = await this.resultsRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            relations: ['tags', 'election', 'location'],
        });

        // entities.map(async (entity: ResultsEntity) => {
        //     const userAltId = entity.userAltirevId;
        //     const  user = await this.userRepository.findOne({where: { altirevId: userAltId}});
        //     const resultLocation = await this.locationRepository.findOne({
        //         where: { user: { id: user?.id } },
        //         relations: ['state', 'lga', 'ward', 'pollingUnit'],  // Load the relations if needed
        //     });
        //     if (resultLocation) {
        //         entity.location = resultLocation;
        //     }
        // })


        // const entities = await this.resultsRepository.createQueryBuilder('result')
        //   .leftJoinAndSelect('result.tags', 'tags')
        //   .leftJoinAndSelect('result.election', 'election')
        //   .leftJoinAndSelect('result.location', 'location')  // Ensure full location details are fetched
        //   .skip((paginationOptions.page - 1) * paginationOptions.limit)
        //   .take(paginationOptions.limit)
        //   .getMany();

        return entities.map((result) => ResultsMapper.toDomain(result));
    }

    async findById(id: Results['id']): Promise<NullableType<Results>> {
        const entity = await this.resultsRepository.findOne({
            where: { id },
            relations: ['election'],
        });
        return entity ? ResultsMapper.toDomain(entity) : null;
    }

    async findByElection(
        electionId: Results['election']['id'],
    ): Promise<Results> {
        const entity = await this.resultsRepository.findOne({
            where: { election: { id: electionId } },
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
        });

        const resultList = entity.map((result) => {
            return ResultsMapper.toDomain(result);
        });
        return resultList ? resultList : [];
    }

    async findByTenantId(tenantId: Results['tenantId']): Promise<Results[]> {
        const entity = await this.resultsRepository.find({
            where: { tenantId },
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
}
