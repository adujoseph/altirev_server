// src/polls/dto/polls-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ReportStatus } from './create-report.dto';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}


export class ReportsQueryDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.DESC,
    description: 'Sort order (ASC or DESC)',
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'The page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10;

  // Your Custom Filters
  @ApiPropertyOptional({ description: 'Filter by Election ID' })
  @IsString()
  @IsOptional()
  readonly electionId?: string;

  @ApiPropertyOptional({ description: 'Filter by Tenant ID' })
  @IsString()
  @IsOptional()
  readonly tenantId?: string;
  
  @ApiPropertyOptional({ description: 'Filter by Agent/User ID' })
  @IsString()
  @IsOptional()
  readonly userAltirevId?: string;

  @ApiPropertyOptional({
    enum: ReportStatus,
    description: 'Filter by poll status',
  })
  @IsEnum(ReportStatus)
  @IsOptional()
  readonly status?: ReportStatus;
  
  @ApiPropertyOptional({ description: 'A general search term to filter results' })
  @IsString()
  @IsOptional()
  readonly search?: string;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}