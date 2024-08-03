import { IsNotEmpty } from 'class-validator';
import { AdminStatus } from '../dto/create-admin.dto';

export class AdminEntity {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  status: AdminStatus;
}
