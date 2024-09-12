import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateResultsDto } from './dto/create-results.dto';
import { UpdateResultsDto } from './dto/update-results.dto';
import { ResultsRepository } from './infrastructure/persistence/results.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Results } from './domain/results';
import { UsersService } from '../users/users.service';
import { S3Service } from '../reports/s3.service';
import { ResultsMapper } from './infrastructure/persistence/relational/mappers/results.mapper';
import {
    ResultsEntity,
    ResultStatus,
} from './infrastructure/persistence/relational/entities/results.entity';
import fs from 'fs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from './infrastructure/persistence/relational/entities/country.entity';
import { StateEntity } from './infrastructure/persistence/relational/entities/state.entity';
import { PollingEntity } from './infrastructure/persistence/relational/entities/pu.entity';
import { WardEntity } from './infrastructure/persistence/relational/entities/ward.entity';
import { LgaEntity } from './infrastructure/persistence/relational/entities/lga.entity';
import { v4 as uuidv4 } from 'uuid';
import { ElectionService } from '../election/election.service';
import { ElectionStatus } from '../election/entities/election.entity';
import { LocationEntity } from '../election/entities/location.entity';

@Injectable()
export class ResultsService {
    constructor(
        private readonly resultsRepository: ResultsRepository,
        @InjectRepository(CountryEntity)
        private countryRepository: Repository<CountryEntity>,
        @InjectRepository(StateEntity)
        private stateRepository: Repository<StateEntity>,
        @InjectRepository(LgaEntity)
        private lgaRepository: Repository<LgaEntity>,
        @InjectRepository(WardEntity)
        private wardRepository: Repository<WardEntity>,
        @InjectRepository(PollingEntity)
        private pollingRepository: Repository<PollingEntity>,
        private readonly userService: UsersService,
        private s3Service: S3Service,
        @Inject(forwardRef(() => ElectionService))
        private electionService: ElectionService,
    ) {}

    async doData(): Promise<string> {
        console.log('Init Seeding .....');

        const data = fs.readFileSync('src/results/data.json');
        const dataArray = JSON.parse(data.toString());

        try {
            const countryEntity = new CountryEntity();
            countryEntity.country = 'Nigeria'.toUpperCase();

            const count = await this.countryRepository.find({});
            if (count.length != 0) {
                console.log('Seed Already done');
                return 'Seed Already done';
            }
            const savedCountry =
                await this.countryRepository.save(countryEntity);

            const arrayState: StateEntity[] = [];
            const arrayLga: LgaEntity[] = [];
            const arrayWard: WardEntity[] = [];
            const arrayPU: PollingEntity[] = [];
            for (let i = 0; i < dataArray.length; i++) {
                const stateObject = dataArray[i];
                const st = new StateEntity();
                st.id = uuidv4();
                st.countryId = savedCountry.id;
                st.stateName = stateObject.state
                    .replace(/-/g, ' ')
                    .toUpperCase();
                arrayState.push(st);

                // const state = await this.stateRepository.save(st);

                const lgArray = stateObject.lgas;
                for (let j = 0; j < lgArray.length; j++) {
                    const lgaObject = lgArray[j];
                    // save lga name to db in lgas table
                    const lg = new LgaEntity();
                    lg.id = uuidv4();
                    lg.stateId = st.id;
                    lg.lgaName = lgaObject.lga.replace(/-/g, ' ').toUpperCase();
                    arrayLga.push(lg);
                    // const lg = await this.lgaRepository.save({
                    //     stateId: state.id,
                    //     lgaName: lgaObject.lga.replace(/-/g, ' ').toUpperCase(),
                    // });

                    const wardsArray = lgaObject.wards;
                    for (let k = 0; k < wardsArray.length; k++) {
                        const wardsObject = wardsArray[k];
                        // save ward to db in wards table
                        const wd = new WardEntity();
                        wd.id = uuidv4();
                        wd.lgaId = lg.id;
                        wd.wardName = wardsObject.ward
                            .replace(/-/g, ' ')
                            .toUpperCase();
                        arrayWard.push(wd);
                        //         const ward = await this.wardRepository.save({
                        //             lgaId: lg.id,
                        //             wardName: wardsObject.ward
                        //                 .replace(/-/g, ' ')
                        //                 .toUpperCase(),
                        //         });

                        const puArray = wardsObject.polling_units;
                        for (let k = 0; k < puArray.length; k++) {
                            // console.log('------------' + puArray[k]);
                            //             // save pu to db in pu table
                            const pu = new PollingEntity();
                            pu.id = uuidv4();
                            pu.wardId = wd.id;
                            pu.pollingUnit = puArray[k]
                                .replace(/-/g, ' ')
                                .toUpperCase();
                            arrayPU.push(pu);
                            //             await this.pollingRepository.save({
                            //                 wardId: ward.id,
                            //                 pollingUnit: puArray[k]
                            //                     .replace(/-/g, ' ')
                            //                     .toUpperCase(),
                            //             });
                        }
                    }
                }
            }

            await this.stateRepository.save(arrayState);
            await this.lgaRepository.save(arrayLga);
            await this.wardRepository.save(arrayWard);
            await this.pollingRepository.save(arrayPU);
            console.log('Location Data Seeding Completed');
        } catch (error) {
            console.log(error);
        }

        return 'Seeding Location Data ................';
    }

    async create(
        createResultsDto: CreateResultsDto,
        file: Express.Multer.File,
    ): Promise<Results> {
        const fileDriver = process.env.FILE_DRIVER;
        if (!fileDriver) {
            throw new InternalServerErrorException('File Driver not found');
        }

        if (!file) {
            throw new BadRequestException('Upload a file for evidence');
        }

        const user = await this.userService.findByAltirevId(
            createResultsDto.userAltirevId,
        );
        if (!user) {
            throw new UnauthorizedException('User with Altirev ID not found');
        }

        const election = await this.electionService.findOne(
            createResultsDto.electionId,
        );
        console.log(election);
        if (!election) {
            throw new NotFoundException('Election not found');
        }

        if (election.status !== ElectionStatus.ONGOING) {
            throw new ForbiddenException('Election is not ongoing');
        }

        const fileUrl = await this.s3Service.uploadFile(file, 'File');

        const locationInfo = await this.electionService.getLocationByUser(
            user.altirevId,
        );
        // if (!locationInfo) {
        //     result.location = new LocationEntity();
        // }

        const result = new Results();
        result.election = election;
        result.userAltirevId = createResultsDto.userAltirevId;
        result.accreditedVoters = createResultsDto.accreditedVoters;
        result.voteCasted = createResultsDto.voteCasted;
        result.counts = createResultsDto.counts;
        result.fileUrl = fileUrl;
        result.location = locationInfo;
        result.status = ResultStatus.PROCESSING;

        const resultEntity = ResultsMapper.toPersistence(result);
        return this.saveElectionResult(resultEntity);
    }

    findAllWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }) {
        return this.resultsRepository.findAllWithPagination({
            paginationOptions: {
                page: paginationOptions.page,
                limit: paginationOptions.limit,
            },
        });
    }

    findOne(id: Results['id']) {
        return this.resultsRepository.findById(id);
    }

    update(id: Results['id'], updateResultsDto: UpdateResultsDto) {
        return this.resultsRepository.update(id, updateResultsDto);
    }

    remove(id: Results['id']) {
        return this.resultsRepository.remove(id);
    }

    private async saveElectionResult(result: ResultsEntity): Promise<Results> {
        console.log(result);
        try {
            return await this.resultsRepository.create(result);
        } catch (error) {
            console.log('Failed to Save Result :: ', error);
        }
        return new Results();
    }

    async getResultByAgent(userAltirevId: Results['userAltirevId']) {
        return this.resultsRepository.findByAgent(userAltirevId);
    }

    async getCountries() {
        return this.countryRepository.find();
    }

    async getCountry(countryId: string) {
        return this.countryRepository.findOneOrFail({
            where: { id: countryId },
        });
    }

    async getAllStates(countryId: string): Promise<StateEntity[]> {
        return this.stateRepository.find({ where: { countryId: countryId } });
    }

    async getState(stateId: string) {
        return this.stateRepository.findOneOrFail({ where: { id: stateId } });
    }

    async getAllLgas(stateId: string): Promise<LgaEntity[]> {
        return this.lgaRepository.find({ where: { stateId: stateId } });
    }

    async getLga(lgaId: string) {
        return this.lgaRepository.findOneOrFail({ where: { id: lgaId } });
    }

    async getAllWards(lgaId: string): Promise<WardEntity[]> {
        return this.wardRepository.find({ where: { lgaId: lgaId } });
    }
    async getWard(wardId: string) {
        return this.wardRepository.findOneOrFail({ where: { id: wardId } });
    }

    async getAllPU(wardId: string): Promise<PollingEntity[]> {
        return this.pollingRepository.find({ where: { wardId: wardId } });
    }

    async getPU(puId: string) {
        return this.pollingRepository.findOneOrFail({ where: { id: puId } });
    }
}
