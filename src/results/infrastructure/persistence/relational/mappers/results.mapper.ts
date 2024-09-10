import { Results } from '../../../../domain/results';
import { ResultsEntity } from '../entities/results.entity';
import * as domain from 'node:domain';

export class ResultsMapper {
    static toDomain(raw: ResultsEntity): Results {
        const domainObject = new Results();
        domainObject.id = raw.id;
        domainObject.userAltirevId = raw.userAltirevId;
        domainObject.electionType = raw.electionType;
        domainObject.accreditedVoters = raw.accreditedVoters;
        domainObject.voteCasted = raw.voteCasted;
        domainObject.counts = raw.counts;
        domainObject.fileUrl = raw.fileUrl;
        domainObject.state = raw.state;
        domainObject.lga = raw.lga;
        domainObject.ward = raw.ward;
        domainObject.pollingUnit = raw.pollingUnit;
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
        persistenceEntity.electionType = domainEntity.electionType;
        persistenceEntity.accreditedVoters = domainEntity.accreditedVoters;
        persistenceEntity.voteCasted = domainEntity.voteCasted;
        persistenceEntity.counts = domainEntity.counts;
        persistenceEntity.userAltirevId = domainEntity.userAltirevId;
        persistenceEntity.fileUrl = domainEntity.fileUrl;
        persistenceEntity.state = domainEntity.state;
        persistenceEntity.lga = domainEntity.lga;
        persistenceEntity.ward = domainEntity.ward;
        persistenceEntity.pollingUnit = domainEntity.pollingUnit;
        persistenceEntity.status = domainEntity.status;

        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;

        return persistenceEntity;
    }
}
