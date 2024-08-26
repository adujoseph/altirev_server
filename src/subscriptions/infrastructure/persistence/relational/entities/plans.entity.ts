import {
  Column,
  CreateDateColumn,
  Entity, Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@Entity({
  name: 'plans',
})
export class PlanEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({type: String})
  @Generated('uuid')
  altirevId: string;

  @ApiProperty({type: String})
  @IsNotEmpty()
  @Column({ type: String,  nullable: false })
  name: string;

  @ApiProperty({type: String})
  @IsNotEmpty()
  @Column({ type: String,  nullable: true })
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ type: 'json',  nullable: false })
  minimumAgent: string;

  @ApiProperty({type: String})
  @IsNotEmpty()
  @Column({ type: String,  nullable: true })
  maximumAgent: string;

  @ApiProperty({type: String})
  @IsOptional()
  @Column({ type: String,  nullable: true })
  features: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
