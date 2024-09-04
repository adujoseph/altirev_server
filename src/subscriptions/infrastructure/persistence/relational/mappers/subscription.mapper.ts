import { Subscription } from '../../../../domain/subscription';
import { SubscriptionEntity } from '../entities/subscription.entity';

export class SubscriptionMapper {
    static toDomain(raw: SubscriptionEntity): Subscription {
        const domainEntity = new Subscription();
        domainEntity.id = raw.id;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: Subscription): SubscriptionEntity {
        const persistenceEntity = new SubscriptionEntity();
        if (domainEntity.id) {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;

        return persistenceEntity;
    }
}
