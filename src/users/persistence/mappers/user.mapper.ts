import { User } from '../../domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.altirevId = raw.altirevId;
    domainEntity.tenantId = raw.tenantId;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.previousPassword = raw.previousPassword;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.username = raw.username;
    domainEntity.role = raw.role;
    domainEntity.phoneNumber = raw.phoneNumber;
    domainEntity.gender = raw.gender;
    domainEntity.state = raw.state;
    domainEntity.country = raw.country;
    // if (raw.photo) {
    //   domainEntity.photo = FileMapper.toDomain(raw.photo);
    // }
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
     // let photo: FileEntity | undefined | null = undefined;

    // if (domainEntity.photo) {
    //   photo = new FileEntity();
    //   photo.id = domainEntity.photo.id;
    //   photo.path = domainEntity.photo.path;
    // } else if (domainEntity.photo === null) {
    //   photo = null;
    // }

    const persistenceEntity = new UserEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.photo = domainEntity.photo;
    persistenceEntity.tenantId = domainEntity.tenantId;
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.previousPassword = domainEntity.previousPassword;
    persistenceEntity.provider = domainEntity.provider;
    persistenceEntity.socialId = domainEntity.socialId;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName;
    persistenceEntity.username = domainEntity.username;
    persistenceEntity.phoneNumber = domainEntity.phoneNumber;
    persistenceEntity.gender = domainEntity.gender;
    persistenceEntity.state = domainEntity.state;
    persistenceEntity.country = domainEntity.country;
    persistenceEntity.role = domainEntity.role;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
