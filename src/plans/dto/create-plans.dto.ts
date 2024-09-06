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
    @IsNumber()
    @IsOptional()
    sub_code: Number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    maxSubscriber: Number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    minSubscriber: Number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    pricing: Number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    feature: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    link: string;
}