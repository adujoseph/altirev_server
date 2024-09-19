import {
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum NoteStatus {
   Read = 'read',
   Unread = 'unread'
}

export enum NoteCategory {
    General = 'general',
    Specific = 'tenants'
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
    message: string;

    @Column({nullable: true})
    tenantId: string;

    @Column({default: NoteStatus.Unread})
    status: NoteStatus;

    @Column({ default: false })
    read: boolean;

    @Column({default: NoteCategory.General})
    category: NoteCategory

    // @ManyToOne(() => UserEntity, (user) => user.id)
    @Column()
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
