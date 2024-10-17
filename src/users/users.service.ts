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
import { StateEntity } from '../results/infrastructure/persistence/relational/entities/state.entity';
import { LgaEntity } from '../results/infrastructure/persistence/relational/entities/lga.entity';
import { WardEntity } from '../results/infrastructure/persistence/relational/entities/ward.entity';
import { PollingEntity } from '../results/infrastructure/persistence/relational/entities/pu.entity';
import { UserMapper } from './persistence/mappers/user.mapper';
// import { ElectionService } from '../election/election.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        private readonly usersRepository: UserRepository,
        private readonly filesService: FilesService,
        private readonly subscriptionsService: SubscriptionsService,
        // private readonly electionService: ElectionService,
        @InjectRepository(StateEntity)
        private stateRepository: Repository<StateEntity>,
        @InjectRepository(LgaEntity)
        private lgaRepository: Repository<LgaEntity>,
        @InjectRepository(WardEntity)
        private wardRepository: Repository<WardEntity>,
        @InjectRepository(PollingEntity)
        private pollingRepository: Repository<PollingEntity>,
        @InjectRepository(LocationEntity)
        private locationRepository: Repository<LocationEntity>,
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
                clonedPayload.password.toString(),
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

    async getUserWithLocation(userId: string): Promise<UserEntity | null | LocationEntity> {
        if(!userId){
            throw new BadRequestException('Invalid Id')
        }
        // const foundUser = await this.UserRepository.findOne({
        //  where :  {altirevId:userId},
        //  relations: ['location'],
        // });
        // if (!foundUser) {
        //     throw new NotFoundException(`User with ID ${userId} not found`);
        // }
    
        const loc = await this.locationRepository.findOne({
            where: { user: { altirevId: userId } }, // Query by foreign key (user)
            relations: ['user', 'state', 'lga', 'ward', 'pollingUnit'], // Include the user relation if necessary
        });
        
       return loc
    }

    async findById(id: User['id']): Promise<NullableType<User>> {
        const user = await this.UserRepository.findOne({
            where: { altirevId: String(id) }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
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

        const errorArray = [];
        // const headers = ['Firstname',	'Lastname',	'Email',	'Phone',	'Gender',	'State',	'LGA',	'Ward',	'PU']
        // @ts-ignore
        // errorArray.push(headers);
        for (let i = 0; i < data.length; i++) {
            const userData = JSON.parse(JSON.stringify(data[i]));
            // console.log("=============== ROW " + (i + 1) + " =====================")
            const state = userData.State;
            //fetch state from location
            const userState = await this.stateRepository.findOne({
                where: {
                    stateName: state
                        .toString()
                        .replace(/-/g, ' ')
                        .toUpperCase(),
                },
            });
            // console.log(userState?.stateName);
            if (!userState) {
                // @ts-ignore
                errorArray.push(userData);
                continue;
            }

            const lga = userData.LGA;
            //fetch lga from location
            const userLga = await this.lgaRepository.findOne({
                where: {
                    lgaName: lga.toString().replace(/-/g, ' ').toUpperCase(),
                },
            });
            // console.log(userLga?.lgaName);
            if (!userLga) {
                // @ts-ignore
                errorArray.push(userData);
                continue;
            }

            const ward = userData.Ward;
            // console.log('ward from sheet : ', ward);
            //fetch ward from location
            const userWard = await this.wardRepository.findOne({
                where: {
                    wardName: ward.toString().replace(/-/g, ' ').toUpperCase(),
                },
            });
            // console.log(userWard?.wardName);
            if (!userWard) {
                // @ts-ignore
                errorArray.push(userData);
                continue;
            }

            const punit = userData.PU;
            //fetch pu from locaion
            const userPu = await this.pollingRepository.findOne({
                where: {
                    pollingUnit: punit
                        .toString()
                        .replace(/-/g, ' ')
                        .toUpperCase(),
                },
            });
            // console.log(userPu?.pollingUnit);
            if (!userPu) {
                // @ts-ignore
                errorArray.push(userData);
                continue;
            }

            const userDto = new CreateUserDto();
            userDto.firstName = userData.Firstname;
            userDto.lastName = userData.Lastname;
            userDto.email = userData.Email;
            userDto.username = userData.Email;
            userDto.password = userData.Phone as string;
            userDto.phoneNumber = userData.Phone;
            userDto.gender = userData.Gender;
            userDto.role = RolesEnum.AGENT;
            userDto.status = StatusEnum.ACTIVE;

            // console.log(userData.Firstname);

            const createdUser = await this.create(userDto, tenantId);
            // console.log(createdUser);

            const userLocation = new LocationEntity();
            userLocation.user = UserMapper.toPersistence(createdUser);
            userLocation.state = userState;
            userLocation.lga = userLga;
            userLocation.ward = userWard;
            userLocation.pollingUnit = userPu;

            // Find existing location for the user
            const existingLocation = await this.locationRepository.findOne({
                where: { user: { id: createdUser.id } },
                relations: ['user', 'state', 'lga', 'ward', 'pollingUnit'], // Load the relations if needed
            });

            if (existingLocation) {
                // Update existing location
                const updateLocation = await this.locationRepository.update(
                    existingLocation.id,
                    {
                        ...userLocation, // Update location details (state, lga, ward, etc.)
                    },
                );
                if (!updateLocation) {
                    await this.usersRepository.remove(createdUser.id);
                    // @ts-ignore
                    errorArray.push(userData);
                }
            } else {
                const location =
                    await this.locationRepository.save(userLocation);
                if (!location) {
                    await this.usersRepository.remove(createdUser.id);
                    // @ts-ignore
                    errorArray.push(userData);
                }
            }
        }

        if (errorArray.length > 0) {
            //write error array to sheet
            const wb = XLSX.utils.book_new();
            // const ws = XLSX.utils.aoa_to_sheet(errorArray);
            const ws = XLSX.utils.json_to_sheet(errorArray);
            XLSX.utils.book_append_sheet(wb, ws, 'Failed Data.xlsx');
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            return buffer;
        }

        return 'success';
    }
}
