import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'election_results' })
export class ResultEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
