import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';

export enum ElectionType {
    PRESIDENTIAL = 'PRESIDENTIAL',
    GUBERNATORIAL = 'GUBERNATORIAL',
    SENATORIAL = 'SENATORIAL',
    REPRESENTATIVE = 'REPRESENTATIVE',
    CHAIRMAN = 'CHAIRMAN',
}

export class CreateResultsDto {
    // Don't forget to use the class-validator decorators in the DTO properties.

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    electionId: string;

    @ApiProperty({
        enum: () => ElectionType,
    })
    @IsNotEmpty()
    electionType: ElectionType;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    @IsNotEmpty()
    accreditedVoters: number;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    voteCasted: number;

    @ApiProperty({
        type: Map<String, Number>,
    })
    @IsNotEmpty()
    counts: Map<string, number>;

    @ApiProperty()
    @IsNotEmpty()
    userAltirevId: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    // @IsNotEmpty()
    file: Express.Multer.File;
}
