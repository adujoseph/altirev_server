import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportEntity } from './reports.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './s3.service';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../users/persistence/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity, UserEntity]), UsersModule],
    providers: [ReportsService, S3Service],
    controllers: [ReportsController],
    exports: [ReportsService, S3Service],
})
export class ReportsModule {}
