// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateResultsDto } from './create-results.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateResultsDto extends PartialType(CreateResultsDto) {
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
