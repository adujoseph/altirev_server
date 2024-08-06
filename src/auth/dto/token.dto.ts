import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class TokenDto {
  @ApiProperty({ example: '12SDF3SDF4FD5FGEF6' })
  @IsNotEmpty()
  userAltirevId: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @MinLength(6)
  token: string;
}
