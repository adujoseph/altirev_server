import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { UserEntity } from '../../users/persistence/entities/user.entity';

@Entity({ name: 'tenants' })
export class Tenant extends EntityRelationalHelper {

    @PrimaryGeneratedColumn('uuid')
    private id: string;

    @Column()
    private name: string;

    @Column()
    private moderator: string;

    @Column()
    private userCount: number;

    @OneToOne(() => UserEntity, (user) => user.id)
    createdBy: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
