// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateResultsDto, ElectionType } from './create-results.dto';
import { IsNotEmpty } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateResultsDto extends PartialType(CreateResultsDto) {
    @ApiProperty({
        enum: () => ElectionType,
    })
    @IsNotEmpty()
    electionType: ElectionType;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    accreditedVoters: number;

    @ApiProperty({
        type: Number,
    })
    voteCasted: number;

    @ApiProperty({
        type: Map<String, Number>,
    })
    @IsNotEmpty()
    counts: Map<string, number>;

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    ctcFilePath: string;
}
