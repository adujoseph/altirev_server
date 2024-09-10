import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { ElectionStatus } from '../entities/election.entity';

export enum AdminStatus {
    Active = 'active',
    Inactive = 'inactive',
}
export class CreateElectionDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsEnum(ElectionStatus)
    @IsNotEmpty()
    status: ElectionStatus;

    @ApiProperty()
    @IsDateString()
    electionDate: Date;
}
