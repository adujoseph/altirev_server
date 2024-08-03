import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/persistence/entities/user.entity';

export enum NoteStatus {
  PREVIOUS = 'previous',
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
}

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: NoteStatus;

  @ManyToOne(() => UserEntity, (user) => user.id)
  createdBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
