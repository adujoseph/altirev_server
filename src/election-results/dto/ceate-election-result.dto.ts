import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export enum ResultStatus {
    PROCESSING = 'processing',
    PENDING = 'pending',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
}

export class CreateElectionResultsDto {

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

    @ApiProperty()
    @IsNotEmpty()
    locationId: string;

    @ApiProperty({ type: 'string', required: true })
    @IsNotEmpty()
    fileUrl: string;

    // @ApiProperty({ enum: () => ResultStatus })
    // status: ResultStatus;
}