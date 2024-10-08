import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { NullableType } from '../../../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';
import { User } from '../../domain/user';
import { UserRepository } from '../user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

@Injectable()
export class UsersRelationalRepository implements UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    async create(data: User): Promise<User> {
        const persistenceModel = UserMapper.toPersistence(data);
        const newEntity = await this.usersRepository.save(
            this.usersRepository.create(persistenceModel),
        );
        return UserMapper.toDomain(newEntity);
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterUserDto | null;
        sortOptions?: SortUserDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<User[]> {
        const where: FindOptionsWhere<UserEntity> = {};
        if (filterOptions?.roles?.length) {
            // @ts-ignore
            where.role = filterOptions.roles.map((role) => ({
                role: role.valueOf(),
            }));
        }

        const entities = await this.usersRepository.find({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
                {},
            ),
        });

        return entities.map((user) => UserMapper.toDomain(user));
    }

    async findById(id: User['id']): Promise<NullableType<User>> {
        const entity = await this.usersRepository.findOne({
            where: { id: Number(id) },
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findByTenantId(tenantId: string): Promise<NullableType<User[]>> {
        const users = await this.usersRepository.find({
            where: { tenantId: tenantId },
        });
        const userList = users.map((user) => {
            return UserMapper.toDomain(user);
        });
        return userList ? userList : null;
    }

    async findByEmail(email: User['email']): Promise<NullableType<User>> {
        if (!email) return null;
        const entity = await this.usersRepository.findOneBy({ email });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findByAltirevId(
        altirevId: User['altirevId'],
    ): Promise<NullableType<User>> {
        if (!altirevId) return null;

        const entity = await this.usersRepository.findOne({
            where: { altirevId },
        });

        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findUserLocation(
        altirevId: User['altirevId'],
    ): Promise<NullableType<User>> {
        if (!altirevId) return null;

        // const entity = await this.usersRepository.findOne({
        //   where: { altirevId },
        //   relations: ['location'],
        // });

        const entity = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.location', 'location') // Joins the location with the user
            .where('user.altirevId = :altirevId', { altirevId: altirevId })
            .getOne();

        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findBySocialIdAndProvider({
        socialId,
        provider,
    }: {
        socialId: User['socialId'];
        provider: User['provider'];
    }): Promise<NullableType<User>> {
        if (!socialId || !provider) return null;

        const entity = await this.usersRepository.findOne({
            where: { socialId, provider },
        });

        return entity ? UserMapper.toDomain(entity) : null;
    }

    async update(id: User['id'], payload: Partial<User>): Promise<User> {
        const entity = await this.usersRepository.findOne({
            where: { id: Number(id) },
        });

        if (!entity) {
            throw new Error('User not found');
        }

        const updatedEntity = await this.usersRepository.save(
            this.usersRepository.create(
                UserMapper.toPersistence({
                    ...UserMapper.toDomain(entity),
                    ...payload,
                }),
            ),
        );

        return UserMapper.toDomain(updatedEntity);
    }

    async remove(id: User['id']): Promise<void> {
        await this.usersRepository.softDelete(id);
    }

    async findByPhone(phone: User['phoneNumber']): Promise<NullableType<User>> {
        if (!phone) return null;
        const entity = await this.usersRepository.findOneBy({
            phoneNumber: phone,
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }
}
