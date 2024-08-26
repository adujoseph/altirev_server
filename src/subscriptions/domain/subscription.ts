import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Subscription {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({type: String})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({type: String})
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
