import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('reports')
export class ReportEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    ward: string;

    @Column()
    pollingUnit: string;

    @Column()
    message: string;

    @Column({ nullable: true })
    videoUrl: string;

    @Column({ nullable: true })
    audioUrl: string;

    @Column({ nullable: true })
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
