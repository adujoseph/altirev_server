import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Subscription } from '../../../../domain/subscription';
import { SubscriptionRepository } from '../../subscription.repository';
import { SubscriptionMapper } from '../mappers/subscription.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class SubscriptionRelationalRepository
    implements SubscriptionRepository
{
    constructor(
        @InjectRepository(SubscriptionEntity)
        private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    ) {}

    async create(data: Subscription): Promise<Subscription> {
        const persistenceModel = SubscriptionMapper.toPersistence(data);
        const newEntity = await this.subscriptionRepository.save(
            this.subscriptionRepository.create(persistenceModel),
        );
        return SubscriptionMapper.toDomain(newEntity);
    }

    async findAllWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }): Promise<Subscription[]> {
        const entities = await this.subscriptionRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
        });

        return entities.map((user) => SubscriptionMapper.toDomain(user));
    }

    async findById(
        id: Subscription['id'],
    ): Promise<NullableType<Subscription>> {
        const entity = await this.subscriptionRepository.findOne({
            where: { id },
        });

        return entity ? SubscriptionMapper.toDomain(entity) : null;
    }

    async update(
        id: Subscription['id'],
        payload: Partial<Subscription>,
    ): Promise<Subscription> {
        const entity = await this.subscriptionRepository.findOne({
            where: { id },
        });

        if (!entity) {
            throw new Error('Record not found');
        }

        const updatedEntity = await this.subscriptionRepository.save(
            this.subscriptionRepository.create(
                SubscriptionMapper.toPersistence({
                    ...SubscriptionMapper.toDomain(entity),
                    ...payload,
                }),
            ),
        );

        return SubscriptionMapper.toDomain(updatedEntity);
    }

    async remove(id: Subscription['id']): Promise<void> {
        await this.subscriptionRepository.delete(id);
    }
}
