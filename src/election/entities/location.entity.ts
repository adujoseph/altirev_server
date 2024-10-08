import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/persistence/entities/user.entity';
import { PollingEntity } from '../../results/infrastructure/persistence/relational/entities/pu.entity';
import { WardEntity } from '../../results/infrastructure/persistence/relational/entities/ward.entity';
import { LgaEntity } from '../../results/infrastructure/persistence/relational/entities/lga.entity';
import { StateEntity } from '../../results/infrastructure/persistence/relational/entities/state.entity';
import { ResultsEntity } from '../../results/infrastructure/persistence/relational/entities/results.entity';

@Entity('locations')
export class LocationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => StateEntity, (state) => state.id, {
        cascade: true,
        createForeignKeyConstraints: false
    })
    @JoinColumn()
    state: StateEntity;

    @OneToOne(() => LgaEntity, (lga) => lga.id, {
        cascade: true,
        createForeignKeyConstraints: false
    })
    @JoinColumn()
    lga: LgaEntity;

    @OneToOne(() => WardEntity, (ward) => ward.id, {
        cascade: true,
        createForeignKeyConstraints: false
    })
    @JoinColumn()
    ward: WardEntity;

    @OneToOne(() => PollingEntity, (pollingUnit) => pollingUnit.id, {
        cascade: true,
        createForeignKeyConstraints: false
    })
    @JoinColumn()
    pollingUnit: PollingEntity;

    @OneToOne(() => UserEntity, (user) => user.id)
    @JoinColumn()
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    role: any;

    @OneToOne(() => ResultsEntity, (result) => result.location)
    result: ResultsEntity;
}
