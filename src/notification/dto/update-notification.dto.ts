import { IsNotEmpty } from 'class-validator';
import { NoteStatus } from '../entities/notification.entity';

export class UpdateNotificationDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  status: NoteStatus;
}
