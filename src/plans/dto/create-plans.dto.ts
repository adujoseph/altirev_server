import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, isNumber, IsNumber, IsString } from "class-validator";

export class CreatePlansDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;


    @ApiProperty()
    @IsNumber()
    sub_code: Number;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subtitle: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    maxSubscriber: Number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    minSubscriber: Number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pricing: Number;


    @ApiProperty()
    @IsArray()
    features: string[];


    @ApiProperty()
    @IsString()
    link: string;
}
