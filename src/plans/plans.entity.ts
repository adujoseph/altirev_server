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
    subtitle: string;

    @Column()
    maxSubscriber: Number;

    @Column()
    minSubscriber: Number;

    @Column()
    pricing: Number;

    @Column("text", { array: true })
    features: string[];

    @Column()
    link: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
