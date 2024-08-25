import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum NoteStatus {
  Active = 'active',
  Inactive = 'inactive',
  Draft = 'draft',
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

  // @ManyToOne(() => UserEntity, (user) => user.id)
  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
