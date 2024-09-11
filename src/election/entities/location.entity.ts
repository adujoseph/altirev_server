import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/persistence/entities/user.entity';
import { PollingEntity } from '../../results/infrastructure/persistence/relational/entities/pu.entity';
import { WardEntity } from '../../results/infrastructure/persistence/relational/entities/ward.entity';
import { LgaEntity } from '../../results/infrastructure/persistence/relational/entities/lga.entity';
import { StateEntity } from '../../results/infrastructure/persistence/relational/entities/state.entity';

@Entity('locations')
export class LocationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => StateEntity, (state) => state.id)
    @JoinColumn()
    state: StateEntity;

    @OneToOne(() => LgaEntity, (lga) => lga.id)
    @JoinColumn()
    lga: LgaEntity;

    @OneToOne(() => WardEntity, (ward) => ward.id)
    @JoinColumn()
    ward: WardEntity;

    @OneToOne(() => PollingEntity, (pollingUnit) => pollingUnit.id)
    @JoinColumn()
    pollingUnit: PollingEntity;

    @ManyToOne(() => UserEntity, (user) => user.altirevId)
    @JoinColumn()
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    role: any;
}
