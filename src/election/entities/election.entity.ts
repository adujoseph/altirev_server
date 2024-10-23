import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/persistence/entities/user.entity';
import { ResultsEntity } from '../../results/infrastructure/persistence/relational/entities/results.entity';
import { ElectionResultsEntity } from '../../election-results/entities/election-results.entity';

export enum ElectionStatus {
    PREVIOUS = 'previous',
    ONGOING = 'ongoing',
    UPCOMING = 'upcoming',
}

@Entity('Elections')
export class Election {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    userId: string;

    @Column({ nullable: true })
    description: string;


    @Column({ type: 'datetime' })
    electionDate: Date;

    @Column({ type: 'datetime', nullable: true })
    startDate: Date;

    @Column({ type: 'datetime', nullable: true })
    endDate: Date;

    @Column({ default: false })
    isActive: boolean;

    @OneToMany(() => ElectionResultsEntity, (result) => result.election)
    electionResults: ElectionResultsEntity[];

    @ManyToOne(() => UserEntity, (user) => user.id)
    createdBy: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
