import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { State } from "./state.entity";
import { Ward } from "./wards.entity";

@Entity('local_governments')
export class LocalGovernment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State, (state) => state.localGovernments)
  @JoinColumn({ name: 'stateId' })
  state: State;

  @OneToMany(() => Ward, (ward) => ward.localGovernment)
  wards: Ward[];
}