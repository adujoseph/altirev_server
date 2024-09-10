import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ElectionType } from '../../../../dto/create-results.dto';
import { Election } from '../../../../../election/election.entity';

export enum ResultStatus {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
}

@Entity({
    name: 'election_results',
})
export class ResultsEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsNotEmpty()
    @Column({ name: 'election_id', type: String, nullable: false })
    @ManyToOne(() => Election, {
        eager: true,
    })
    @JoinColumn()
    electionId: string;

    @IsNotEmpty()
    @Column({ name: 'election_type', type: String, nullable: false })
    @IsEnum(ElectionType)
    electionType: ElectionType;

    @IsNotEmpty()
    @Column({ name: 'accredited_voters', type: Number, nullable: false })
    accreditedVoters: number;

    @IsNotEmpty()
    @Column({ name: 'vote_casted', type: Number, nullable: false })
    voteCasted: number;

    @IsNotEmpty()
    @Column({ name: 'election_counts', type: 'json', nullable: false })
    counts: Map<string, number>;

    // @ApiProperty({
    //     type: FileType,
    // })
    // @IsNotEmpty()
    // // @Column({ name: 'ctc_file', type: String, nullable: false })
    // @OneToOne(() => FileEntity, {
    //     eager: true,
    // })
    // @JoinColumn()
    // file: FileType;

    @Column({ name: 'file_url', type: String, nullable: false })
    fileUrl: string;

    @Column({ name: 'user_id', type: String, nullable: false })
    userAltirevId: string;

    @Column({ type: String, nullable: false })
    state: string;

    @Column({ type: String, nullable: false })
    lga: string;

    @Column({ type: String, nullable: false })
    ward: string;

    @Column({ type: String, nullable: false })
    pollingUnit: string;

    @Column({ type: String, nullable: false })
    status: ResultStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
