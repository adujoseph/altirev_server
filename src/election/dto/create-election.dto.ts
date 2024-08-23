import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum AdminStatus {
  Active = 'active',
  Inactive = 'inactive',
}
export class CreateElectionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(AdminStatus)
  @IsNotEmpty()
  status: AdminStatus;
}
