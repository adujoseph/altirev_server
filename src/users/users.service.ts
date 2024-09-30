import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
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
import {
    RolesEnum,
    StatusEnum,
    UserEntity,
} from './persistence/entities/user.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { LocationEntity } from '../election/entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Helpers } from '../utils/helper';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        private readonly usersRepository: UserRepository,
        private readonly filesService: FilesService,
        private readonly subscriptionsService: SubscriptionsService,
    ) {}

    async create(
        createProfileDto: CreateUserDto,
        tenantId: string,
    ): Promise<User> {
        const clonedPayload = {
            provider: AuthProvidersEnum.email,
            altirevId: uuidv4(),
            tenantId: tenantId,
            location: new LocationEntity(),
            ...createProfileDto,
        };

        if (clonedPayload.paymentRef) {
            const response = await this.subscriptionsService.verifyPayment(
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
            clonedPayload.tenantId = uuidv4();
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

    async findById(id: User['id']): Promise<NullableType<User>> {
        // return this.usersRepository.findById(id);
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.usersRepository.findUserLocation(user.altirevId);
    }

    async findByTenant(tenantId: string): Promise<NullableType<User[]>> {
        return await this.usersRepository.findByTenantId(tenantId);
    }

    findByEmail(email: User['email']): Promise<NullableType<User>> {
        return this.usersRepository.findByEmail(email);
    }

    findByAltirevId(altirevId: User['altirevId']): Promise<NullableType<User>> {
        return this.usersRepository.findByAltirevId(altirevId);
    }

    async findUserLocation(altirevId: string): Promise<NullableType<User>> {
        return await this.usersRepository.findUserLocation(altirevId);
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

    // async updateRole(updateRole: UpdateUserRoleDto): Promise<any> {
    //   const user = await this.UserRepository.findOneBy({
    //     email: updateRole.email,
    //   });
    //   if (user) {
    //     (user.tenantId = updateRole.moderator_tenant_id),
    //       (user.state = updateRole.role);
    //     user.local_govt = updateRole.local_govt;
    //     user.ward = updateRole.ward;
    //     user.polling_unit = updateRole.polling_unit;
    //     user.role = updateRole.role;
    //     return await this.UserRepository.save(user);
    //   } else {
    //     throw new UnprocessableEntityException({
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       message: 'user with this email does not exist',
    //       error: true,
    //     });
    //   }
    // }

    async update(
        id: User['id'],
        payload: DeepPartial<User>,
    ): Promise<User | null> {
        const clonedPayload = { ...payload };
        if (
            clonedPayload.password &&
            clonedPayload.previousPassword !== clonedPayload.password
        ) {
            console.log('checking for old password, then update');
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
            console.log('role exists, then update');
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

    async processBulkUserUpload(file: any, tenantId: string) {
        const userByTenant =
            await this.usersRepository.findByTenantId(tenantId);
        if (!userByTenant) {
            return Helpers.fail('No Tenant Found for ID');
        }

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // const wb = XLSX.utils.book_new();
        // const ws = XLSX.utils.aoa_to_sheet([
        //   ["A1", "B1", "C1"],
        //   ["A2", "B2", "C2"],
        //   ["A3", "B3", "C3"]
        // ]);
        // wb.Sheets[0] = ws;
        // const files = XLSX.writeFile(workbook, "Failed Data.xlsx");
        // res.header('Content-Disposition', 'attachment; filename=anlikodullendirme.xlsx');
        // res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // res.send(files.buffer);

        for (let i = 0; i < data.length; i++) {
            const userData = JSON.parse(JSON.stringify(data[i]));

            const state = userData.State;
            //fetch state from location

            const lga = userData.LGA;
            //fetch lga from location

            const ward = userData.Ward;
            //fetch ward from location

            const punit = userData.PU;
            //fetch pu from locaion

            const userDto = new CreateUserDto();
            userDto.firstName = userData.Firstname;
            userDto.lastName = userData.Lastname;
            userDto.email = userData.Email;
            userDto.password = userData.Phone as string;
            userDto.phoneNumber = userData.Phone;
            userDto.gender = userData.Gender;
            userDto.role = RolesEnum.AGENT;
            userDto.status = StatusEnum.ACTIVE;

            console.log(userData.Firstname);

            const createdUser = await this.create(userDto, tenantId);
            console.log(createdUser);
        }
    }
}
