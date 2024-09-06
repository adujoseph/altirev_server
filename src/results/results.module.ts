import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { RelationalResultsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';
import { FilesLocalService } from '../files/uploader/local/files.service';
import { FilesS3Module } from '../files/uploader/s3/files.module';
import { FilesLocalModule } from '../files/uploader/local/files.module';
import { FilesS3Service } from '../files/uploader/s3/files.service';
import { ReportsModule } from '../reports/reports.module';
import { S3Service } from '../reports/s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { ResultsEntity } from './infrastructure/persistence/relational/entities/results.entity';
import { CountryEntity } from './infrastructure/persistence/relational/entities/country.entity';
import { StateEntity } from './infrastructure/persistence/relational/entities/state.entity';
import { LgaEntity } from './infrastructure/persistence/relational/entities/lga.entity';
import { WardEntity } from './infrastructure/persistence/relational/entities/ward.entity';
import { PollingEntity } from './infrastructure/persistence/relational/entities/pu.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        ResultsEntity,
          CountryEntity,
          StateEntity,
          LgaEntity,
          WardEntity,
          PollingEntity,
      ]),
        UsersModule,
        FilesModule,
        ReportsModule,
        RelationalResultsPersistenceModule,
    ],
    controllers: [ResultsController],
    providers: [ResultsService, S3Service],
    exports: [ResultsService, RelationalResultsPersistenceModule],
})
export class ResultsModule {}
