import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportEntity } from './reports.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './s3.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity])],
    providers: [ReportsService, S3Service],
    controllers: [ReportsController],
    exports: [ReportsService],
})
export class ReportsModule {}
