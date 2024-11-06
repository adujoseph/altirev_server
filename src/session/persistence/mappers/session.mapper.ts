import { UserEntity } from '../../../users/persistence/entities/user.entity';
import { UserMapper } from '../../../users/persistence/mappers/user.mapper';
import { Session } from '../../domain/session';
import { SessionEntity } from '../entities/session.entity';

export class SessionMapper {
    static toDomain(raw: SessionEntity): Session {
        const domainEntity = new Session();
        domainEntity.id = raw.id;
        if (raw.userId) {
            domainEntity.userId = raw.userId;
        }
        domainEntity.hash = raw.hash;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt;
        return domainEntity;
    }

    static toPersistence(domainEntity: Session): SessionEntity {
        const persistenceEntity = new SessionEntity();
        if (domainEntity.id && typeof domainEntity.id === 'number') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.hash = domainEntity.hash;
        persistenceEntity.userId = domainEntity.userId;
        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;
        persistenceEntity.deletedAt = domainEntity.deletedAt;

        return persistenceEntity;
    }
}
