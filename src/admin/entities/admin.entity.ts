import { AdminStatus } from '../dto/create-admin.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AdminStatus_ {
  PREVIOUS = 'previous',
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
}
@Entity('Admin')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status: AdminStatus = AdminStatus.Active;
}
