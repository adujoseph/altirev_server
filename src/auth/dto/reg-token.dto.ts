import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegTokenDto {
    @ApiProperty({ example: 'name@email.com' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '08123456789' })
    @IsNotEmpty()
    phone: string;
}
