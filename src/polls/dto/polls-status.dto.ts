import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PollsStatusDto {
    @ApiProperty()
    @IsNotEmpty()
    confirm: boolean;
}