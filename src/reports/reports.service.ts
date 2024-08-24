import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportsRepository: Repository<ReportEntity>,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<ReportEntity> {
    const report = this.reportsRepository.create(createReportDto);
    return this.reportsRepository.save(report);
  }

  async findAll(): Promise<ReportEntity[]> {
    return this.reportsRepository.find();
  }

  async findOne(id: string): Promise<ReportEntity | null> {
    return this.reportsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.reportsRepository.delete(id);
  }
}

// reports/reports.service.ts
