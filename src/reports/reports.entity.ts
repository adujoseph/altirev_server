import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ReportStatus } from './dto/create-report.dto';
import { ChangeReportStatusDto } from './dto/change-report-status.dto';

@Entity('reports')
export class ReportEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tenantId: string;

    @Column({ nullable: true, default: '' })
    title: string;

    @Column()
    userId: string;

    @Column({ nullable: true, default: '' })
    reasons: string;

    @Column({ nullable: true })
    modifiedBy: string;

    @Column()
    ward: string;

    @Column()
    pollingUnit: string;

    
    @Column()
    state: string;

    @Column()
    lga: string;

    @Column()
    message: string;

    @Column({ default: false })
    requestCall: Boolean;

    @Column({ default: ReportStatus.Pending })
    status: ReportStatus;

    @Column({ nullable: true, default: '' })
    fileUrl: string;

    @Column({ nullable: true, default: ''  })
    videoUrl: string;

    @Column({ nullable: true, default: ''  })
    audioUrl: string;

    @Column({ nullable: true, default: ''  })
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
