import { IsNotEmpty, IsOptional } from 'class-validator';
import { NoteStatus } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  status: NoteStatus;
}
