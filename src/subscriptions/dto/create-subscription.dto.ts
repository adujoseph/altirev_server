import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({type: String})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({type: String})
  @IsNotEmpty()
  amount: string;
}
