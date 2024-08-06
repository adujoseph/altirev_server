import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otp_tokens')
export class TokenEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @PrimaryGeneratedColumn('uuid')
  altirevId: string;

  @ApiProperty({
    type: String,
    example: '12342w5345JKGKKGH87',
  })
  @Column({ type: String, nullable: true })
  userAltirevId: string | null;

  @ApiProperty({
    type: String,
    example: '123456',
  })
  @Column({ type: String, nullable: true })
  token: string | null;
}
