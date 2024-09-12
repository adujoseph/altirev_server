import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ResultStatus } from '../infrastructure/persistence/relational/entities/results.entity';
import { LocationEntity } from '../../election/entities/location.entity';
import { JoinColumn, OneToOne } from 'typeorm';
import { Election } from '../../election/entities/election.entity';

export class Results {
    @ApiProperty({
        type: String,
    })
    @IsOptional()
    id: string;

    @ApiProperty({
        type: String,
    })
    // @IsNotEmpty()
    // electionId: string;
    @ApiProperty({
        type: Election,
    })
    @IsNotEmpty()
    election: Election;

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
        type: Map<string, number>,
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
        type: LocationEntity,
    })
    location: LocationEntity;

    // @ApiProperty({
    //     type: String,
    // })
    // state: string;

    // @ApiProperty({
    //     type: String,
    // })
    // lga: string;

    // @ApiProperty({
    //     type: String,
    // })
    // ward: string;

    // @ApiProperty({
    //     type: String,
    // })
    // pollingUnit: string;

    @ApiProperty({
        enum: () => ResultStatus,
    })
    status: ResultStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
