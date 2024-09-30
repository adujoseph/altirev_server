import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto, ReportStatus } from './dto/create-report.dto';
import { ReportEntity } from './reports.entity';
import { UpdateReportDto } from './dto/update-report.dto';
import { ChangeReportStatusDto } from './dto/change-report-status.dto';
import { UsersService } from '../users/users.service';
import {
    RolesEnum,
    UserEntity,
} from '../users/persistence/entities/user.entity';
import moment from 'moment';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(ReportEntity)
        private reportsRepository: Repository<ReportEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private userService: UsersService,
    ) {}

    async create(createReportDto: CreateReportDto): Promise<ReportEntity> {
        const report = this.reportsRepository.create(createReportDto);
        return this.reportsRepository.save(report);
    }

    async findAll(): Promise<ReportEntity[]> {
        return this.reportsRepository.find();
    }

    async getEscalatedElections(): Promise<ReportEntity[]> {
        return this.reportsRepository.find({
            where: { status: ReportStatus.Escalated },
        });
    }

    async agentStatusByTenant(id: string) {
        if (!id) {
            throw new BadRequestException('Id not found');
        }
        const tenant = await this.userRepository.findOneBy({ tenantId: id });
        if (!tenant) {
            throw new BadRequestException('Invalid tenant id');
        }
        const agents = await this.userRepository.find({
            where: { tenantId: id, role: RolesEnum.AGENT },
        });
        //condition when agents return empty array
        const currentTime = moment();

        const agentStatus = await Promise.all(
            agents.map(async (agent) => {
                const lastReport = await this.reportsRepository.findOne({
                    where: { userId: agent.altirevId },
                    order: { createdAt: 'DESC' },
                });

                let isCompliant = false;
                if (lastReport) {
                    const lastReportTime = moment(lastReport.createdAt);
                    const hoursDifference = currentTime.diff(
                        lastReportTime,
                        'hours',
                    );
                    isCompliant = hoursDifference <= 3;
                }

                return {
                    ...agent,
                    isCompliant, // true if compliant, false if not
                    lastReportTime: lastReport ? lastReport.createdAt : null,
                };
            }),
        );

        return agentStatus;
    }

    async findMe(id: string) {
        return this.reportsRepository.find({ where: { userId: id } });
    }

    async findReportTenant(id: string): Promise<ReportEntity[]> {
        return this.reportsRepository.find({ where: { tenantId: id } });
    }
    async chanegStatus(id: string, statusDto: ChangeReportStatusDto) {
        if (!id) {
            throw new BadRequestException('Id not found');
        }
        let report = await this.reportsRepository.findOneBy({ id });
        if (!report) {
            throw new BadRequestException('Report does not exist');
        }
        report.reasons = statusDto.reasons;
        report.status = statusDto.status;
        report.modifiedBy = statusDto.modifiedBy;

        return await this.reportsRepository.save(report);
    }

    async findOne(id: string): Promise<ReportEntity | null> {
        return this.reportsRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.reportsRepository.delete(id);
    }

    async updateReport_(id: string, electionData: UpdateReportDto) {
        let report = await this.reportsRepository.findOneBy({ id });
        if (report) {
            report = { ...report, ...electionData };
            return this.reportsRepository.save(report);
        } else {
            let errorObject = {
                message: `No election with id ${id} exist`,
            };
            return errorObject;
        }
    }

    async updateReport(
        id: string,
        updateReportDto: UpdateReportDto,
    ): Promise<ReportEntity> {
        const report = await this.reportsRepository.findOne({ where: { id } });
        if (!report) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }

        const updatedReport = Object.assign(report, updateReportDto);
        return await this.reportsRepository.save(updatedReport);
    }
}

// reports/reports.service.ts
