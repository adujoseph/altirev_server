import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { IsNotEmpty } from 'class-validator';

@Entity({
    name: 'polling_unit',
})
export class PollingEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsNotEmpty()
    @Column({ name: 'ward_id', type: String, nullable: false })
    wardId: string;

    @IsNotEmpty()
    @Column({ name: 'polling_unit', type: String, nullable: false })
    pollingUnit: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
