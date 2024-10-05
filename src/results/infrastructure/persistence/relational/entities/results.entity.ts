import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable, ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LocationEntity } from '../../../../../election/entities/location.entity';
import { Election } from '../../../../../election/entities/election.entity';
import { Tags } from '../../../../../tags/entities/tag.entity';
// import { Election } from '../../../../../election/election.entity';

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
    @Column({ name: 'accredited_voters', type: Number, nullable: false })
    accreditedVoters: number;

    @IsNotEmpty()
    @Column({ name: 'vote_casted', type: Number, nullable: false })
    voteCasted: number;

    @IsNotEmpty()
    @Column({ name: 'election_counts', type: 'json', nullable: false })
    counts: Map<string, number>;

    @Column({ name: 'file_url', type: String, nullable: false })
    fileUrl: string;

    @Column({ name: 'user_id', type: String, nullable: false })
    userAltirevId: string;

    @OneToOne(() => LocationEntity, (location) => location.id)
    location: LocationEntity;

    @OneToOne(() => Election, (election) => election.id)
    @JoinColumn()
    election: Election;

    @Column({ type: String, nullable: false })
    status: ResultStatus;

    @Column({ name: 'tenant_id', type: String, nullable: false, })
    tenantId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Tags, (tag) => tag.result)
    @JoinTable({
        name: 'result_tags', // Join table name
        joinColumn: {
            name: 'result_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    tags: Tags[];
}
