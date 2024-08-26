import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'election_results' })
export class Result {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
