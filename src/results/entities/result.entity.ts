import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'election_results' })
export class ResultEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    electionId: string;
}
