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

    @Column({ nullable: true })
    sub_code: Number;

    @Column({ nullable: true })
    subtitle: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    maxSubscriber: Number;

    @Column({ nullable: true })
    minSubscriber: Number;

    @Column({ nullable: true })
    pricing: Number;

    // @Column("text", { array: true })
    // features: string[];
    @Column({ nullable: true })
    feature: string;

    @Column()
    link: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
