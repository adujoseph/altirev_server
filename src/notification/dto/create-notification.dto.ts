import { IsEnum, IsNotEmpty } from 'class-validator';
import { NoteStatus } from '../entities/notification.entity';
export class CreateNotificationDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(NoteStatus)
  status: NoteStatus;
}
