import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LocalGovernment } from "./localgovt.entity";
import { PollingUnit } from "./pollingunit.entity";

@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => LocalGovernment, (lg) => lg.wards)
  @JoinColumn({ name: 'localGovernmentId' })
  localGovernment: LocalGovernment;

  @OneToMany(() => PollingUnit, (pu) => pu.ward)
  pollingUnits: PollingUnit[];
}

