import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/persistence/entities/user.entity';
import { ResultsEntity } from '../../results/infrastructure/persistence/relational/entities/results.entity';
import { PollsEntity } from '../../polls/entities/polls.entity';

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

    @Column({ nullable: true })
    electionId: string;

    @Column({ type: 'datetime' })
    electionDate: Date;

    @Column({ type: 'datetime', nullable: true })
    startDate: Date;

    @Column({ type: 'datetime', nullable: true })
    endDate: Date;

    @Column({ default: false })
    isActive: boolean;

    @OneToMany(() => ResultsEntity, (result) => result.election)
    electionResults: ResultsEntity[];

    @OneToMany(() => PollsEntity, (result) => result.election)
    pollResults: PollsEntity[];

    @ManyToOne(() => UserEntity, (user) => user.id)
    createdBy: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
