import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { Gender } from '../../users/persistence/entities/user.entity';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'bambam' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '+2348934564378' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ enum: () => Gender })
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ example: 'Abuja' })
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Nigeria' })
  @IsNotEmpty()
  country: string;
}
