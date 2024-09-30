import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ReportStatus } from './create-report.dto';

export class ChangeReportStatusDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    reasons: string;

    @ApiProperty()
    @IsEnum(ReportStatus)
    status: ReportStatus;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    modifiedBy: string;
}
