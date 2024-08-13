import { IsNotEmpty } from 'class-validator';
import { NoteStatus } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  status: NoteStatus;
}
