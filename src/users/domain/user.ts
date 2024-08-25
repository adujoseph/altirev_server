import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Gender,
  RolesEnum,
  StatusEnum,
} from '../persistence/entities/user.entity';

const idType = Number;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  tenantId: string;

  @ApiProperty({
    type: String,
  })
  altirevId: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  // @Expose({ groups: ['me', 'admin'] })
  email: string;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: String,
    example: 'bambam4sure',
  })
  username: string | null;

  @ApiProperty({
    type: String,
    example: '+234855478989',
  })
  phoneNumber: string | null;

  @ApiProperty({
    enum: () => Gender,
  })
  gender: Gender;

  @ApiProperty({
    type: String,
    example: 'Abuja',
  })
  state: string | null;

  @ApiProperty({
    type: String,
    example: 'Nigeria',
  })
  country: string | null;

  @ApiProperty({
    type: () => String,
  })
  photo?: string | null;

  @ApiProperty({
    enum: () => RolesEnum,
  })
  role: RolesEnum;

  @ApiProperty({
    enum: () => StatusEnum,
  })
  status: StatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
