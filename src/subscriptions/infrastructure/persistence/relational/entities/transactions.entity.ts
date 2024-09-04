import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export enum RegStatus {
    COMPLETED = 'completed',
    PAYMENT = 'payment',
}

@Entity({
    name: 'transactions',
})
export class TransactionsEntity extends EntityRelationalHelper {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: String })
    @Generated('uuid')
    altirevId: string;

    @ApiProperty({ type: String })
    @Column({ type: String, nullable: true })
    email: string;

    @ApiProperty({ type: String })
    @Column({ type: String, nullable: true })
    paymentRef: string;

    @ApiProperty()
    @Column({ type: 'json', nullable: false })
    paymentData: string;

    @ApiProperty({ type: String })
    @Column({ type: String, nullable: true })
    planId: string;

    @ApiProperty({ type: String })
    @Column({ type: String, nullable: true })
    status: string;

    @ApiProperty({ enum: RegStatus })
    @Column({ type: String, nullable: true })
    regStatus: RegStatus;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;
}
