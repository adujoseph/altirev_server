import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty, IsDateString, IsEmail } from 'class-validator';
import { ReportStatus } from './create-report.dto';


export class SuspendUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    userEmail: string
}