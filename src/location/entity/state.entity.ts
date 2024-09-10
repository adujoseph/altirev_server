import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Country } from './country.entity';
import { LocalGovernment } from './localgovt.entity';


@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Country, country => country.states)
  country: Country;

  @OneToMany(() => LocalGovernment, (lg) => lg.state)
  localGovernments: LocalGovernment[];
}