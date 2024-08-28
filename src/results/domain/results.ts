import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ElectionType } from '../dto/create-results.dto';
import { Column } from 'typeorm';
import { FileType } from '../../files/domain/file';

export class Results {
    @ApiProperty({
        type: String,
    })
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

    // @ApiProperty({
    //   type: String
    // })
    // @IsNotEmpty()
    // ctcFilePath: string

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    userAltirevId: string;

    @ApiProperty({
        type: FileType,
    })
    fileData: FileType;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
