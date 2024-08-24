import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  title: string;

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
  @IsOptional()
  videoUrl?: string;

  @ApiProperty()
  @IsOptional()
  audioUrl?: string;

  @ApiProperty()
  @IsOptional()
  imageUrl?: string;
}
