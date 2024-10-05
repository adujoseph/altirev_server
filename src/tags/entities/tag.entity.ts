import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { ResultsEntity } from '../../results/infrastructure/persistence/relational/entities/results.entity';

@Entity({ name: 'tags' })
export class Tags extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' , name: 'name' })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => ResultsEntity, (result) => result.tags)
  result: ResultsEntity[];
}
