import {
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Election, ElectionStatus } from './entities/election.entity';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { LocationEntity } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { ResultsService } from '../results/results.service';
import { UsersService } from '../users/users.service';
import { UserMapper } from '../users/persistence/mappers/user.mapper';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

@Injectable()
export class ElectionService {
    constructor(
        @InjectRepository(Election)
        private electionRepository: Repository<Election>,
        @InjectRepository(LocationEntity)
        private locationRepository: Repository<LocationEntity>,
        @Inject(forwardRef(() => ResultsService))
        private resultService: ResultsService,
        private userService: UsersService,
    ) {}

    async createElection(electionDto: CreateElectionDto): Promise<Election> {
        console.log({ electionDto });
        const electionData = await this.electionRepository.save(electionDto);
        return electionData;
    }

    async updateUserRoleAndLocation(
        userJwtPayload: JwtPayloadType,
        locationDto: CreateLocationDto,
    ): Promise<LocationEntity> {
        console.log({ locationDto });

        const moderator = await this.userService.findByAltirevId(
            locationDto.modId,
        );
        if (!moderator) {
            throw new UnauthorizedException('Unauthorized Request');
        }

        const user = await this.userService.findByEmail(locationDto.email);
        if (!user) {
            throw new Error('User not found');
        }

        // const userLocation = await this.getLocationByUser(user.altirevId);

        const state = await this.resultService.getState(locationDto.state);
        const lga = await this.resultService.getLga(locationDto.lga);
        const ward = await this.resultService.getWard(locationDto.ward);
        const pu = await this.resultService.getPU(locationDto.pollingUnit);

        const locationData = new LocationEntity();
        locationData.state = state;
        locationData.lga = lga;
        locationData.ward = ward;
        locationData.pollingUnit = pu;
        locationData.user = UserMapper.toPersistence(user);

        if (locationDto.hasOwnProperty('role') && locationDto.role != null) {
            const updatedUser = await this.userService.update(user.id, {
                tenantId: moderator.tenantId,
                role: locationData.role,
            });
            if (!updatedUser) {
                throw new Error('Unable to update User Role');
            }
        }
        return await this.locationRepository.save(locationData);
    }

    async getLocationByUser(userId: string) {
        const userDomain = await this.userService.findByAltirevId(userId);
        if (!userDomain) {
            throw new Error('User not found');
        }
        return this.locationRepository.findOneOrFail({
            where: { user: UserMapper.toPersistence(userDomain) },
        });
    }

    async findAll(status: ElectionStatus): Promise<Election[]> {
        return await this.electionRepository.find({ where: { status } });
    }

    async findOne(id: string): Promise<Election | null> {
        return await this.electionRepository.findOneBy({ id });
    }

    async updateElection(
        id: string,
        electionData: UpdateElectionDto,
    ): Promise<Election | {}> {
        const election = await this.electionRepository.findOneBy({ id });
        if (election) {
            election.name = electionData.name || election.name;
            election.electionDate =
                electionData.electionDate || election.electionDate;
            election.status = electionData.status || election.status;
            return this.electionRepository.save(election);
        }

        const errorObject = {
            message: `No election with id ${id} exist`,
        };
        return errorObject;
    }

    async deleteElection(id: string): Promise<void> {
        await this.electionRepository.delete(id);
    }
}
