import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ElectionResultStatusDto {
    
    @ApiProperty()
    @IsNotEmpty()
    confirm: boolean;
}