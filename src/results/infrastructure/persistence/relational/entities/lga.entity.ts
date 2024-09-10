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
    name: 'lga_table',
})
export class LgaEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsNotEmpty()
    @Column({ name: 'state_id', type: String, nullable: false })
    stateId: string;

    @IsNotEmpty()
    @Column({ name: 'name', type: String, nullable: false })
    lgaName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
