import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionStatus } from './election.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Elections')
@Controller('elections')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @Post()
  async createElection(@Body() createElectionDto: any) {
    return this.electionService.createElection(createElectionDto);
  }

  @Get()
  async findAllElections(@Query('status') status: ElectionStatus) {
    return this.electionService.findAll(status);
  }

  @Get(':id')
  async findOneElection(@Param('id') id: string) {
    return this.electionService.findOne(+id);
  }

  @Put(':id')
  async updateElection(
    @Param('id') id: string,
    @Body() updateElectionDto: any,
  ) {
    return this.electionService.updateElection(+id, updateElectionDto);
  }

  @Delete(':id')
  async deleteElection(@Param('id') id: string) {
    return this.electionService.deleteElection(+id);
  }
}
