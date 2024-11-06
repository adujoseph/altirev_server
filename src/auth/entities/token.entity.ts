import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otp_tokens')
export class TokenEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({
        type: String,
        example: 'name@email.com',
    })
    @Column({ type: String, nullable: false, unique: true })
    email: string;

    @ApiProperty({
        type: String,
        example: '123456',
    })
    @Column({ type: String, nullable: true })
    token: string;
}
