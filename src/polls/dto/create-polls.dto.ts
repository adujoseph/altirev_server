import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum PollsStatus {
    PROCESSING = 'processing',
    PENDING = 'pending',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
}

export class CreatePollsDto {
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
        type: Number,
    })
    @IsNotEmpty()
    invalidVotes: number;

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
    tenantId: string;

    @ApiProperty()
    @IsNotEmpty()
    locationId: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File;

    // @ApiProperty({ enum: () => ResultStatus })
    // status: ResultStatus;
}