import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../users/persistence/entities/user.entity';

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

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ElectionStatus,
    default: ElectionStatus.UPCOMING,
  })
  status: ElectionStatus;

  @Column({ type: 'datetime' })
  electionDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  createdBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
