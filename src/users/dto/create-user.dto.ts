import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  // decorators here
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import {
  Gender,
  RolesEnum,
  StatusEnum,
} from '../persistence/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  lastName: string | null;

  @ApiProperty({ example: 'bambam', type: String })
  @IsNotEmpty()
  username: string | null;

  @ApiProperty({ example: '+234980778697', type: String })
  @IsNotEmpty()
  phoneNumber: string | null;

  @ApiProperty({ enum: () => Gender })
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ example: 'Abuja', type: String })
  @IsNotEmpty()
  state: string | null;

  @ApiProperty({ example: 'Nigeria', type: String })
  @IsNotEmpty()
  country: string | null;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  photo?: string | null;

  @ApiPropertyOptional({ enum: RolesEnum })
  @IsOptional()
  role: RolesEnum;

  @ApiPropertyOptional({ enum: StatusEnum })
  @IsOptional()
  status: StatusEnum;

  hash?: string | null;
}
