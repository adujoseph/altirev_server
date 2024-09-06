import { Module } from '@nestjs/common';
import { ResultsRepository } from '../results.repository';
import { ResultsRelationalRepository } from './repositories/results.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsEntity } from './entities/results.entity';
import { CountryEntity } from './entities/country.entity';
import { StateEntity } from './entities/state.entity';
import { LgaEntity } from './entities/lga.entity';
import { WardEntity } from './entities/ward.entity';
import { PollingEntity } from './entities/pu.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ResultsEntity])],
    providers: [
        {
            provide: ResultsRepository,
            useClass: ResultsRelationalRepository,
        },
    ],
    exports: [ResultsRepository],
})
export class RelationalResultsPersistenceModule {}
