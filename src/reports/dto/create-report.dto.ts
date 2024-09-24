import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ReportStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
    Escalated = 'escalated'
}
export class CreateReportDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    ward: string;

    @ApiProperty()
    @IsString()
    pollingUnit: string;

    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty()
    @IsEnum(ReportStatus)
    status: ReportStatus;

    @ApiProperty()
    @IsOptional()
    fileUrl?: string;

    @ApiProperty()
    @IsOptional()
    videoUrl?: string;

    @ApiProperty()
    @IsOptional()
    audioUrl?: string;

    @ApiProperty()
    @IsOptional()
    imageUrl?: string;
}
