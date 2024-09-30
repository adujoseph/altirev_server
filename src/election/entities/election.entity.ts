import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/persistence/entities/user.entity';
import { ResultsEntity } from '../../results/infrastructure/persistence/relational/entities/results.entity';

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

    // @Column({
    //     type: 'enum',
    //     enum: ElectionStatus,
    //     default: ElectionStatus.UPCOMING,
    // })
    // status: ElectionStatus;

    @Column({ type: 'datetime' })
    electionDate: Date;

    @Column({ type: 'datetime' })
    startDate: Date;

    @Column({ type: 'datetime' })
    endDate: Date;

    @Column({ default: false })
    isActive: boolean;

    @OneToOne(() => ResultsEntity, (result) => result.id)
    @JoinColumn()
    results: ResultsEntity;

    @ManyToOne(() => UserEntity, (user) => user.id)
    createdBy: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
