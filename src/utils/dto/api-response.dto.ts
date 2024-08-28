import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum ApiResponseType {
    SUCCESS = 'success',
    ERROR = 'error',
    FAILED = 'failed',
    PENDING = 'pending',
}

export class ApiResponseDto {
    @ApiProperty({ example: 'name@email.com' })
    @IsNotEmpty()
    status: ApiResponseType;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    message: string;

    @ApiProperty({ example: '' })
    data: any;
}
