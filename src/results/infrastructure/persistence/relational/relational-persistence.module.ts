import { Module } from '@nestjs/common';
import { ResultsRepository } from '../results.repository';
import { ResultsRelationalRepository } from './repositories/results.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsEntity } from './entities/results.entity';
import { LocationEntity } from '../../../../election/entities/location.entity';
import { UserEntity } from '../../../../users/persistence/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ResultsEntity, LocationEntity, UserEntity])],
    providers: [
        {
            provide: ResultsRepository,
            useClass: ResultsRelationalRepository,
        },
    ],
    exports: [ResultsRepository],
})
export class RelationalResultsPersistenceModule {}
