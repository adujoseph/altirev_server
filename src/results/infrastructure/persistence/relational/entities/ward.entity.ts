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
    name: 'wards_table',
})
export class WardEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsNotEmpty()
    @Column({ name: 'lga_id', type: String, nullable: false })
    lgaId: string;

    @IsNotEmpty()
    @Column({ name: 'wards', type: String, nullable: false })
    wardName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
