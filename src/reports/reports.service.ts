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
import { LocationEntity } from '../election/entities/location.entity';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';
import { ReportsQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(ReportEntity)
        private reportsRepository: Repository<ReportEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        // @InjectRepository(LocationEntity)
        // private locationRepository: Repository<LocationEntity>,
        // private userService: UsersService,
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
        const reports = await this.reportsRepository.find({
            where: { tenantId: id },
        });
        // reports.map((report) => {
        //     console.log(report.userId);
        // });

        return reports;
    }

    async suspend(suspendUserDto) {
        const { userEmail } = suspendUserDto;
        if (!userEmail) {
            throw new BadRequestException('Email not found');
        }
        const user = await this.userRepository.findOneBy({ email: userEmail });
        if (!user) {
            throw new BadRequestException('not a valid user');
        }
        try {
            user.role = RolesEnum.USER;
            user.tenantId = '';
            await this.userRepository.save(user);
            return {
                message: 'user suspended successfully',
                status: true,
            };
        } catch (err) {
           // console.log(err);
            return {
                message: 'user suspension failed',
                status: false,
                error: err,
            };
        }
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

    async getUserById(id: string) {
        const user = await this.userRepository.findOneBy({ altirevId: id });
        if (!user) {
            throw new BadRequestException('not a valid user');
        }
        return await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['location'],
        });
    }


    //async findAllPaginated(
   //      pollsQueryDto: ReportsQueryDto,
   //    ): Promise<PageDto<ReportEntity>> {
    //     // 1. Create a query builder
     //   const queryBuilder = this.reportsRepository.createQueryBuilder('reports');
    
    //     // 2. Add JOINs to fetch related data efficiently
    //     // This solves the N+1 problem from your original getResults()
    //     queryBuilder
    //       .leftJoinAndSelect('report.location', 'location')
    //       .leftJoinAndSelect('poll.election', 'election');
    
    //     // 3. Apply Filters based on DTO
    //     if (pollsQueryDto.electionId) {
    //       queryBuilder.andWhere('poll.electionId = :electionId', {
    //         electionId: pollsQueryDto.electionId,
    //       });
    //     }
    
    //     if (pollsQueryDto.tenantId) {
    //       queryBuilder.andWhere('poll.tenantId = :tenantId', {
    //         tenantId: pollsQueryDto.tenantId,
    //       });
    //     }
        
    //     if (pollsQueryDto.userAltirevId) {
    //       queryBuilder.andWhere('poll.userAltirevId = :userAltirevId', {
    //         userAltirevId: pollsQueryDto.userAltirevId,
    //       });
    //     }
    
    //     if (pollsQueryDto.status) {
    //       queryBuilder.andWhere('poll.status = :status', {
    //         status: pollsQueryDto.status,
    //       });
    //     }
        
    //     // Add full-text search (searching across related entity fields)
    //     if (pollsQueryDto.search) {
    //         queryBuilder.andWhere(
    //           '(location.name ILIKE :search OR election.name ILIKE :search)',
    //           { search: `%${pollsQueryDto.search}%` },
    //         );
    //         // NOTE: This assumes 'location' has a 'name' field and 'election' has a 'name' field.
    //         // Adjust these field names to match your actual LocationEntity and ElectionEntity.
    //     }
    
    //     // 4. Apply Sorting
    //     queryBuilder.orderBy('poll.createdAt', pollsQueryDto.order); // Default sort by createdAt
    
    //     // 5. Apply Pagination
    //     queryBuilder.skip(pollsQueryDto.skip).take(pollsQueryDto.limit);
    
    //     // 6. Execute Query
    //     const [entities, itemCount] = await queryBuilder.getManyAndCount();
    
    //     // 7. Create Metadata and Response DTO
    //     const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: pollsQueryDto });
    
//    return new PageDto(entities, pageMetaDto);
//       }
}

// reports/reports.service.ts
