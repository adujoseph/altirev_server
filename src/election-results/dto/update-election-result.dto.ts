import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateElectionResultsDto } from './ceate-election-result.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateElectionResultDto extends PartialType(CreateElectionResultsDto) {
    @ApiProperty({ type: 'string', required: true })
    @IsNotEmpty()
    videoUrl: string;
}