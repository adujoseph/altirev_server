import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AdminStatus {
  Active = 'active',
  Inactive = 'inactive',
}
export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: () => AdminStatus
  })
  // @IsEnum(AdminStatus)/
  status: AdminStatus;
}
