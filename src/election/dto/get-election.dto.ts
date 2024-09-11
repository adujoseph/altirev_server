import { IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetElectionsFilterDto {
    @IsOptional()
    @IsString()
    status?: string; // Filter by election status ('ongoing', 'upcoming', 'next')

    @IsOptional()
    @IsString()
    search?: string; // Search by name or description

    @IsOptional()
    @Type(() => Number)
    page?: number; // Pagination: Page number

    @IsOptional()
    @Type(() => Number)
    limit?: number; // Pagination: Number of items per page

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDirection?: 'ASC' | 'DESC'; // Sort direction

    @IsOptional()
    @IsString()
    sortField?: string; // Sort by field (name, date, etc.)
}