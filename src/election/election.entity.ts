import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/persistence/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  name: string;

  @Column({ type: 'enum', enum: ElectionStatus })
  @ApiProperty()
  status: ElectionStatus;

  @Column({ type: 'date' })
  @ApiProperty()
  electionDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @ApiProperty()
  createdBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
