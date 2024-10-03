import { Results } from '../../../../domain/results';
import { ResultsEntity } from '../entities/results.entity';

export class ResultsMapper {
    static toDomain(raw: ResultsEntity): Results {
        const domainObject = new Results();
        domainObject.id = raw.id;
        domainObject.election = raw.election;
        domainObject.userAltirevId = raw.userAltirevId;
        domainObject.accreditedVoters = raw.accreditedVoters;
        domainObject.voteCasted = raw.voteCasted;
        domainObject.counts = raw.counts;
        domainObject.fileUrl = raw.fileUrl;
        domainObject.location = raw.location;
        domainObject.status = raw.status;
        domainObject.createdAt = raw.createdAt;
        domainObject.updatedAt = raw.updatedAt;

        return domainObject;
    }

    static toPersistence(domainEntity: Results): ResultsEntity {
        const persistenceEntity = new ResultsEntity();
        if (domainEntity.id) {
            persistenceEntity.id = domainEntity.id;
        }

        persistenceEntity.userAltirevId = domainEntity.userAltirevId;
        persistenceEntity.election = domainEntity.election;
        persistenceEntity.accreditedVoters = domainEntity.accreditedVoters;
        persistenceEntity.voteCasted = domainEntity.voteCasted;
        persistenceEntity.counts = domainEntity.counts;
        persistenceEntity.userAltirevId = domainEntity.userAltirevId;
        persistenceEntity.fileUrl = domainEntity.fileUrl;
        persistenceEntity.location = domainEntity.location;
        persistenceEntity.status = domainEntity.status;
        persistenceEntity.tenantId = domainEntity.tenantId;

        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;

        return persistenceEntity;
    }
}
