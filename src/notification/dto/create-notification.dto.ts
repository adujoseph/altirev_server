import { IsEnum, IsNotEmpty } from 'class-validator';
import { NoteStatus } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsEnum(NoteStatus)
  status: NoteStatus;
}
