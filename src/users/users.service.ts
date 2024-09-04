import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './persistence/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { FilesService } from '../files/files.service';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { RolesEnum, StatusEnum } from './persistence/entities/user.entity';
import * as process from 'node:process';
import axios from 'axios';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UserRepository,
        private readonly filesService: FilesService,
        private readonly subscriptionsService: SubscriptionsService,
    ) {}

    async create(createProfileDto: CreateUserDto): Promise<User> {
        const clonedPayload = {
            provider: AuthProvidersEnum.email,
            altirevId: uuidv4(),
            tenantId: '',
            ...createProfileDto,
        };

        if (clonedPayload.paymentRef) {
            let response = await this.subscriptionsService.verifyPayment(
                clonedPayload.paymentRef,
            );
            if (
                response.data.status != true ||
                response.data.data.status != 'success'
            ) {
                throw new BadRequestException('Payment Verification Failed');
            }

            const resp = await this.subscriptionsService.saveTransaction(
                clonedPayload.planId,
                response.data.data,
            );
            if (!resp) {
                throw new InternalServerErrorException(
                    'Error Saving Transaction details',
                );
            }
            clonedPayload.role = RolesEnum.MODERATOR;
        }

        if (clonedPayload.password) {
            const salt = await bcrypt.genSalt();
            clonedPayload.password = await bcrypt.hash(
                clonedPayload.password,
                salt,
            );
        }

        if (clonedPayload.email) {
            const userObject = await this.usersRepository.findByEmail(
                clonedPayload.email,
            );
            if (userObject) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        email: 'Account with Email Already Exist',
                    },
                });
            }
        }

        // if (clonedPayload.photo?.id) {
        //   const fileObject = await this.filesService.findById(
        //     clonedPayload.photo.id,
        //   );
        //   if (!fileObject) {
        //     throw new UnprocessableEntityException({
        //       status: HttpStatus.UNPROCESSABLE_ENTITY,
        //       errors: {
        //         photo: 'imageNotExists',
        //       },
        //     });
        //   }
        //   clonedPayload.photo = fileObject;
        // }

        if (clonedPayload.role) {
            const roleObject = Object.values(RolesEnum)
                .map(String)
                .includes(String(clonedPayload.role));
            if (!roleObject) {
                throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    errors: {
                        role: 'No such Role',
                    },
                });
            }
        } else {
            clonedPayload.role = RolesEnum.USER;
        }

        if (clonedPayload.status) {
            const statusObject = Object.values(StatusEnum)
                .map(String)
                .includes(String(clonedPayload.status));
            if (!statusObject) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        status: 'Invalid Status',
                    },
                });
            }
        } else {
            clonedPayload.status = StatusEnum.ACTIVE;
        }

        return this.usersRepository.create(clonedPayload);
    }

    findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterUserDto | null;
        sortOptions?: SortUserDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<User[]> {
        return this.usersRepository.findManyWithPagination({
            filterOptions,
            sortOptions,
            paginationOptions,
        });
    }

    findById(id: User['id']): Promise<NullableType<User>> {
        return this.usersRepository.findById(id);
    }

    findByEmail(email: User['email']): Promise<NullableType<User>> {
        return this.usersRepository.findByEmail(email);
    }

    findByAltirevId(altirevId: User['altirevId']): Promise<NullableType<User>> {
        return this.usersRepository.findByAltirevId(altirevId);
    }

    findBySocialIdAndProvider({
        socialId,
        provider,
    }: {
        socialId: User['socialId'];
        provider: User['provider'];
    }): Promise<NullableType<User>> {
        return this.usersRepository.findBySocialIdAndProvider({
            socialId,
            provider,
        });
    }

    async update(
        id: User['id'],
        payload: DeepPartial<User>,
    ): Promise<User | null> {
        const clonedPayload = { ...payload };

        if (
            clonedPayload.password &&
            clonedPayload.previousPassword !== clonedPayload.password
        ) {
            const salt = await bcrypt.genSalt();
            clonedPayload.password = await bcrypt.hash(
                clonedPayload.password,
                salt,
            );
        }

        if (clonedPayload.email) {
            const userObject = await this.usersRepository.findByEmail(
                clonedPayload.email,
            );

            if (userObject && userObject.id !== id) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        email: 'emailAlreadyExists',
                    },
                });
            }
        }

        if (clonedPayload.photo) {
            const fileObject = await this.filesService.findById(
                clonedPayload.photo,
            );
            if (!fileObject) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        photo: 'imageNotExists',
                    },
                });
            }
            clonedPayload.photo = fileObject;
        }

        if (clonedPayload.role) {
            const roleObject = Object.values(RolesEnum)
                .map(String)
                .includes(String(clonedPayload.role));
            if (!roleObject) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        role: 'roleNotExists',
                    },
                });
            }
        }

        if (clonedPayload.status) {
            const statusObject = Object.values(StatusEnum)
                .map(String)
                .includes(String(clonedPayload.status));
            if (!statusObject) {
                throw new UnprocessableEntityException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        status: 'statusNotExists',
                    },
                });
            }
        }

        return this.usersRepository.update(id, clonedPayload);
    }

    async remove(id: User['id']): Promise<void> {
        await this.usersRepository.remove(id);
    }

    async findByPhone(phone: string): Promise<NullableType<User>> {
        return this.usersRepository.findByPhone(phone);
    }
}
