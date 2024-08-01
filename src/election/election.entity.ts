import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/persistence/entities/user.entity';
// Assuming User entity exists

export enum ElectionStatus {
  PREVIOUS = 'previous',
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
}

@Entity()
export class Election {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ElectionStatus })
  status: ElectionStatus;

  @Column({ type: 'date' })
  electionDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  createdBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
