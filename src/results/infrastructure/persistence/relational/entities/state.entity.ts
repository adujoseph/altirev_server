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
    name: 'states_table',
})
export class StateEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsNotEmpty()
    @Column({ name: 'country_id', type: String, nullable: false })
    countryId: string;

    @IsNotEmpty()
    @Column({ name: 'states', type: String, nullable: false })
    stateName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
