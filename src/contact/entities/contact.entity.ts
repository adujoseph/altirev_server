import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class ContactEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    message: string;

    @Column({default: false})
    isReplied: Boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
