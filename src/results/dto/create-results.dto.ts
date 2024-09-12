import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateResultsDto {
    // Don't forget to use the class-validator decorators in the DTO properties.

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    electionId: string;

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
        type: Map<string, number>,
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
