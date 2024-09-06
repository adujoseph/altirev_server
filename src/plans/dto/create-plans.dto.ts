import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    isNumber,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreatePlansDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    subtitle: string;

    @ApiProperty()
    @IsOptional()
    sub_code?: Number;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    maxSubscriber: Number;

    @ApiProperty()
    @IsOptional()
    minSubscriber?: Number;

    @ApiProperty()
    @IsOptional()
    pricing?: Number;

    @ApiProperty()
    @IsOptional()
    feature?: string;

    @ApiProperty()
    @IsString()
    link: string;
}