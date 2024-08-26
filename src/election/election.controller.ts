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
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';

@ApiTags('Elections')
@Controller('Elections')
export class ElectionController {
    constructor(private readonly electionService: ElectionService) {}

    @Post()
    createElection(@Body() createElectionDto: CreateElectionDto) {
        return this.electionService.createElection(createElectionDto);
    }

    @Get()
    async findAllElections(@Query('status') status: ElectionStatus) {
        return this.electionService.findAll(status);
    }

    @Get(':id')
    findOneElection(@Param('id') id: string) {
        return this.electionService.findOne(id);
    }

    @Put(':id')
    async updateElection(
        @Param('id') id: string,
        @Body() updateElectionDto: UpdateElectionDto,
    ) {
        return this.electionService.updateElection(id, updateElectionDto);
    }

    @Delete(':id')
    async deleteElection(@Param('id') id: string) {
        return this.electionService.deleteElection(id);
    }
}
