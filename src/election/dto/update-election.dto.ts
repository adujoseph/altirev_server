import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ElectionStatus } from '../entities/election.entity';

export enum AdminStatus {
    Active = 'active',
    Inactive = 'inactive',
}
export class UpdateElectionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(ElectionStatus)
    @IsNotEmpty()
    status: ElectionStatus;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    electionDate: Date;
}
