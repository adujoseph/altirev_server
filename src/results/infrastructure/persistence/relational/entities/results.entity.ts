import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ElectionType } from '../../../../dto/create-results.dto';
import { FileEntity } from '../../../../../files/persistence/entities/file.entity';
import { FileType } from '../../../../../files/domain/file';

@Entity({
    name: 'election_results',
})
export class ResultsEntity extends EntityRelationalHelper {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        enum: () => ElectionType,
    })
    @IsNotEmpty()
    @Column({ name: 'election_type', type: String, nullable: false })
    @IsEnum(ElectionType)
    electionType: ElectionType;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    @Column({ name: 'accredited_voters', type: Number, nullable: false })
    accreditedVoters: number;

    @ApiProperty({
        type: Number,
    })
    @Column({ name: 'vote_casted', type: Number, nullable: false })
    voteCasted: number;

    @ApiProperty({
        type: Map<String, Number>,
    })
    @IsNotEmpty()
    @Column({ name: 'election_counts', type: 'json', nullable: false })
    counts: Map<string, number>;

    @ApiProperty({
        type: FileType,
    })
    @IsNotEmpty()
    // @Column({ name: 'ctc_file', type: String, nullable: false })
    @OneToOne(() => FileEntity, {
        eager: true,
    })
    @JoinColumn()
    file: FileType;

    @ApiProperty()
    @IsNotEmpty()
    @Column({ name: 'user_id', type: String, nullable: false })
    userAltirevId: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;
}
