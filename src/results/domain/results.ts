import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ElectionType } from '../dto/create-results.dto';
import { ResultStatus } from '../infrastructure/persistence/relational/entities/results.entity';

export class Results {
    @ApiProperty({
        type: String,
    })
    @IsOptional()
    id: string;

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
        type: Number,
    })
    userAltirevId: string;

    // @ApiProperty({
    //     type: FileType,
    // })
    //
    // fileData: FileType;

    @ApiProperty({
        type: String,
    })
    fileUrl: string;

    @ApiProperty({
        type: String,
    })
    state: string;

    @ApiProperty({
        type: String,
    })
    lga: string;

    @ApiProperty({
        type: String,
    })
    ward: string;

    @ApiProperty({
        type: String,
    })
    pollingUnit: string;

    @ApiProperty({
        enum: () => ResultStatus,
    })
    status: ResultStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
