import { Injectable } from '@nestjs/common';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlansEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    sub_code: Number;

    @Column()
    description: string;

    @Column()
    maxSubscriber: Number;

    @Column()
    minSubscriber: Number;

    @Column()
    pricing: Number;

    @Column()
    features: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
