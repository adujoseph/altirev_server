import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
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
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    // @ApiProperty()
    // @IsEnum(ElectionStatus)
    // status: ElectionStatus;

    @ApiProperty()
    @IsDateString()
    electionDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    endDate: Date;
}
