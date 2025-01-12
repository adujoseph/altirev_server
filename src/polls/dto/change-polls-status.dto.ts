import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { PollsStatus } from './create-polls.dto';

export class ChangePollsStatusDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    reasons: string;

    @ApiProperty()
    @IsEnum(PollsStatus)
    status: PollsStatus;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    modifiedBy: string;
}