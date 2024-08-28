import { Results } from '../../../../domain/results';
import { ResultsEntity } from '../entities/results.entity';

export class ResultsMapper {
    static toDomain(raw: ResultsEntity): Results {
        const domainEntity = new Results();
        domainEntity.id = raw.id;
        domainEntity.userAltirevId = raw.userAltirevId;
        domainEntity.electionType = raw.electionType;
        domainEntity.accreditedVoters = raw.accreditedVoters;
        domainEntity.voteCasted = raw.voteCasted;
        domainEntity.counts = raw.counts;
        domainEntity.fileData = raw.file;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;

        return domainEntity;
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
        persistenceEntity.file = domainEntity.fileData;
        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;

        return persistenceEntity;
    }
}
