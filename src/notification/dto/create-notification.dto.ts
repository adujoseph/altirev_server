import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { NoteCategory, NoteStatus } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    message: string;

    @ApiProperty()
    @IsNotEmpty()
    createdBy: string;

    @ApiProperty()
    @IsOptional()
    category?: NoteCategory;

    @ApiProperty()
    @IsOptional()
    tenantId?: string;
}
