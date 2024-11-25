import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePollsDto } from './create-polls.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePollsDto extends PartialType(
    CreatePollsDto,
) {
    @ApiProperty({ type: 'string', required: true })
    @IsNotEmpty()
    videoUrl: string;
}