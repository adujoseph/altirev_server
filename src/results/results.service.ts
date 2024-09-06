import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
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
    ) {}

    async doData(): Promise<String> {
        console.log('In JSON Data Service .....');
        const data = fs.readFileSync('src/results/data.json');
        const dataArray = JSON.parse(data.toString());

        try {
            const countryEntity = new CountryEntity();
            countryEntity.country = "Nigeria";

            const count = await this.countryRepository.find({});
            if (count.length != 0){
                return 'Seed Already done';
            }
            const savedCountry = await this.countryRepository.save(countryEntity);

            for (let i = 0; i < dataArray.length; i++) {
                let stateObject = dataArray[i];
                // console.log('---' + stateObject.state);
                //save state name to db
                const state = await this.stateRepository.save({countryId: savedCountry.id, stateName: stateObject.state});

                let lgArray = stateObject.lgas;
                for (let j = 0; j < lgArray.length; j++) {
                    let lgaObject = lgArray[j];
                    // console.log('------' + lgaObject.lga);
                    // save lga name to db in lgas table
                    const lg = await this.lgaRepository.save({stateId: state.id, lgaName: lgaObject.lga});

                    let wardsArray = lgaObject.wards;
                    for (let k = 0; k < wardsArray.length; k++) {
                        let wardsObject = wardsArray[k];
                        // console.log('---------' + wardsObject.ward);
                        // save ward to db in wards table
                        const ward = await this.wardRepository.save({lgaId: lg.id, wardName: wardsObject.ward});

                        let puArray = wardsObject.polling_units;
                        for (let k = 0; k < puArray.length; k++) {
                            // console.log('------------' + puArray[k]);
                            // save pu to db in pu table
                            await this.pollingRepository.save({wardId: ward.id, pollingUnit: puArray[k]});
                        }
                    }
                }
            }
        }catch (error) {
            console.log(error);
        }

        return "Seeding Location Data ................";
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

        const fileUrl = await this.s3Service.uploadFile(file, 'File');

        const result = new Results();
        result.userAltirevId = createResultsDto.userAltirevId;
        result.electionType = createResultsDto.electionType;
        result.accreditedVoters = createResultsDto.accreditedVoters;
        result.voteCasted = createResultsDto.voteCasted;
        result.counts = createResultsDto.counts;
        result.fileUrl = fileUrl;
        result.state = '';
        result.lga = '';
        result.ward = '';
        result.pollingUnit = '';
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
            console.log(error);
        }
        return new Results();
    }

    async getResultByAgent(userAltirevId: Results['userAltirevId']) {
        return this.resultsRepository.findByAgent(userAltirevId);
    }
}
