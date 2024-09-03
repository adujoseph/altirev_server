import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateResultDto {
    @IsString()
    userId: string;

    @IsString()
    electionId: string;
}
