import { IsNotEmpty, IsOptional } from 'class-validator';
import { NoteStatus } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto  {
    @ApiProperty()
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsOptional()
    notificationId: string;

    @ApiProperty()
    @IsOptional()
    status: NoteStatus;
}
