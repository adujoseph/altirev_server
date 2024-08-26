import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    Column,
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/persistence/entities/user.entity';

import { EntityRelationalHelper } from '../../../utils/relational-entity-helper';

@Entity({
    name: 'session',
})
export class SessionEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    hash: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
