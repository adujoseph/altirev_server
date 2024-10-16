import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ElectionResultsService } from './election-results.service';
import { ElectionResultsEntity } from './entities/election-results.entity';
import { CreateElectionResultsDto } from './dto/ceate-election-result.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UpdateElectionResultDto } from './dto/update-election-result.dto';
import { ElectionResultStatusDto } from './dto/election-result-status.dto';

@ApiTags('Election Results')
@Controller('election-results')
export class ElectionResultsController {
    constructor(
        private readonly electionResultService: ElectionResultsService,
    ) {}

    @Post('submit-result')
    async postResults(
        @Body() createResultDto: CreateElectionResultsDto,
    ): Promise<ElectionResultsEntity> {
        return this.electionResultService.postResult(createResultDto);
    }

    @Get()
    async getResults(): Promise<any[]> {
        return await this.electionResultService.getAllResults();
    }

    @Get('/agent/:id')
    async getAgentResults(
        @Param('id') id: string,
    ): Promise<ElectionResultsEntity[]> {
        return await this.electionResultService.getAgentResults(id);
    }

    @Get('/tenant/:id')
    async getTenantResults(
        @Param('id') id: string,
    ): Promise<ElectionResultsEntity[]> {
        return await this.electionResultService.getTenantResults(id);
    }

    @Patch(':id')
    async updateElectionResult(
        @Param('id') id: string,
        @Body() updateResult: UpdateElectionResultDto,
    ): Promise<ElectionResultsEntity> {
        return await this.electionResultService.updateElectionResult(
            id,
            updateResult,
        );
    }

    @Patch('status/:id')
    async electionResultStatus(
        @Param('id') id: string,
        @Body() resultStatus: ElectionResultStatusDto,
    ): Promise<ElectionResultsEntity> {
        return await this.electionResultService.updateResultStatus(id, resultStatus);
    }

    @Get('counts/:electionId')
    async getElectionCounts(
        @Param('electionId') electionId: string,
        @Query() locationFilter: { stateId?: string; localGovernmentId?: string; wardId?: string; pollingUnitId?: string }
    ) {
        return this.electionResultService.getAggregatedVotes2(electionId, locationFilter);
    }

    @Get('aggregate')
    async getAggregateResults(
        @Query('stateId') stateId?: string,
        @Query('localGovernmentId') localGovernmentId?: string,
        @Query('pollingUnitId') pollingUnitId?: string,
    ) {
        return this.electionResultService.getAggregateResults(
            stateId,
            localGovernmentId,
            pollingUnitId,
        );
    }
}
