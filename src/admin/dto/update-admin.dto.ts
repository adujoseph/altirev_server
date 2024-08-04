import { PartialType } from '@nestjs/swagger';
import { AdminStatus, CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  status: AdminStatus;
}
