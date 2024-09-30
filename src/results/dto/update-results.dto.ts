// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateResultsDto } from './create-results.dto';

export class UpdateResultsDto extends PartialType(CreateResultsDto) {
}
