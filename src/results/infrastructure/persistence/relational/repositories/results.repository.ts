import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultsEntity } from '../entities/results.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Results } from '../../../../domain/results';
import { ResultsRepository } from '../../results.repository';
import { ResultsMapper } from '../mappers/results.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ResultsRelationalRepository implements ResultsRepository {
    constructor(
        @InjectRepository(ResultsEntity)
        private readonly resultsRepository: Repository<ResultsEntity>,
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
        });

        return entities.map((user) => ResultsMapper.toDomain(user));
    }

    async findById(id: Results['id']): Promise<NullableType<Results>> {
        const entity = await this.resultsRepository.findOne({
            where: { id },
            relations: ['election'],
        });
        console.log(entity);
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
    ): Promise<NullableType<Results>> {
        const entity = await this.resultsRepository.findOne({
            where: { userAltirevId },
        });

        return entity ? ResultsMapper.toDomain(entity) : null;
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
