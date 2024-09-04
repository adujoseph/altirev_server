// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ReportStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}
// export class UpdateReportDto {
//     @ApiProperty()
//     @IsString()
//     @IsOptional()
//     title: string;

//     @ApiProperty()
//     @IsString()
//     @IsOptional()
//     userId: string;

//     @ApiProperty()
//     @IsString()
//     @IsOptional()
//     ward: string;

//     @ApiProperty()
//     @IsString()
//     @IsOptional()
//     pollingUnit: string;

//     @ApiProperty()
//     @IsString()
//     @IsOptional()
//     message: string;

//     @ApiProperty()
//     @IsEnum(ReportStatus)
//     @IsOptional()
//     status: ReportStatus;

//     @ApiProperty()
//     @IsOptional()
//     fileUrl?: string;

//     @ApiProperty()
//     @IsOptional()
//     videoUrl?: string;

//     @ApiProperty()
//     @IsOptional()
//     audioUrl?: string;

//     @ApiProperty()
//     @IsOptional()
//     imageUrl?: string;
// }


import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';

export class UpdateReportDto extends PartialType(CreateReportDto) {}
