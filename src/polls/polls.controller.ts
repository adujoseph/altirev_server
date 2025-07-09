import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { CreatePollsDto } from './dto/create-polls.dto';
import { PollsEntity } from './entities/polls.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePollsDto } from './dto/update-polls.dto';
import { PollsStatusDto } from './dto/polls-status.dto';
import { ChangePollsStatusDto } from './dto/change-polls-status.dto';

@ApiTags('polls')
@Controller('polls')
export class PollsController {
    constructor(private readonly pollsService: PollsService) { }

    @Post('submit-result')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async postResults(
        @Body() createPollsDto: CreatePollsDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<PollsEntity | any> {
        return this.pollsService.postResults(createPollsDto, file);
    }

    @Get()
    async getResults(): Promise<PollsEntity[]> {
        return this.pollsService.getResults();
    }

    @Get('/:result_id')
    async getSingleResult(
        @Param('result_id') id: string,
    ): Promise<PollsEntity> {
        return this.pollsService.getSingleResult(id);
    }

    @Patch('/:result_id')
    async updateSingleResult(
        @Param('result_id') id: string,
        @Body() updatePollsDto: UpdatePollsDto,
    ): Promise<PollsEntity> {
        return this.pollsService.updateSingleResult(id, updatePollsDto);
    }

    @Delete('/:result_id')
    async deleteSingleResult(
        @Param('result_id') id: string,
    ): Promise<PollsEntity> {
        return this.pollsService.deleteSingleResult(id);
    }

    @Get('/tenant/:tenant_id')
    async getResultsByTenanatId(
        @Param('tenant_id') id: string,
    ): Promise<PollsEntity[]> {
        return this.pollsService.getResultsByTenanatId(id);
    }

    @Get('/agent/:agent_id')
    async getResultsByAgentId(
        @Param('agent_id') id: string,
    ): Promise<PollsEntity[]> {
        return this.pollsService.getResultsByAgentId(id);
    }

    @Patch('/status/:result_id')
    async updatePollStatus(
        @Param('result_id') id: string,
        @Body() updatePollsDto: PollsStatusDto,
    ): Promise<any> {
        return this.pollsService.updatePollStatus(id, updatePollsDto);
    }

    @Get('/vote_count/:election_id')
    async voteCount(@Param('election_id') id: string): Promise<any> {
        return this.pollsService.voteCount(id);
    }

    @Patch('change-status/:id')
    async changeReport(
        @Param('id') id: string,
        @Body() changePollsStatusDto: ChangePollsStatusDto,
    ) {
        return this.pollsService.changeStatus(id, changePollsStatusDto);
    }

    // @Get('/filter/:electionId')
    // @ApiQuery({ name: 'stateId', required: false, type: 'String' })
    // @ApiQuery({ name: 'lgaId', required: false, type: 'String' })
    // @ApiQuery({ name: 'wardId', required: false, type: 'String' })
    // @ApiQuery({ name: 'pollingUnitId', required: false, type: 'String' })
    // async findByLocation(
    //     @Param('electionId') electionId: string,
    //     @Query('stateId') stateId?: string,
    //     @Query('lgaId') lgaId?: string,
    //     @Query('wardId') wardId?: string,
    //     @Query('pollingUnitId') pollingUnitId?: string,
    // ) {
    //     return this.pollsService.findResultsByLocation({
    //         electionId,
    //         stateId,
    //         lgaId,
    //         wardId,
    //         pollingUnitId,
    //     });
    // }

    // @Get('/vote/counts')
    // async getVoteCountsByLocation(
    //     @Query('electionId') electionId?: string,
    //     @Query('stateId') stateId?: string,
    //     @Query('lgaId') lgaId?: string,
    //     @Query('wardId') wardId?: string,
    //     @Query('pollingUnitId') pollingUnitId?: string,
    // ) {
    //     const finalCounts = await this.pollsService.getVoteCountsByLocation({
    //         electionId,
    //         stateId,
    //         lgaId,
    //         wardId,
    //         pollingUnitId,
    //     });
    //     const baba = new ApiResponse();
    //     baba.status = ApiResponseType.SUCCESS;
    //     baba.message = 'Vote counts retrieved successfully';
    //     baba.data = finalCounts;

    //     return baba;

    // }
}
