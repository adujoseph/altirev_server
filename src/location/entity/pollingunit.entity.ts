// polling-unit.entity.ts
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LocalGovernment } from "./localgovt.entity";
import { Ward } from "./wards.entity";


@Entity('polling_units')
export class PollingUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Ward, (ward) => ward.pollingUnits)
  @JoinColumn({ name: 'wardId' })
  ward: Ward;
}