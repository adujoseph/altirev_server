import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { CreatePollsDto } from './dto/create-polls.dto';
import { PollsEntity } from './entities/polls.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePollsDto } from './dto/update-polls.dto';

@ApiTags('polls')
@Controller('polls')
export class PollsController {
    constructor(private readonly pollsService: PollsService) {}

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
        @Param('result_id') id : string
    ): Promise<PollsEntity> {
        return this.pollsService.getSingleResult(id);
    }

    @Patch('/:result_id')
    async updateSingleResult(
        @Param('result_id') id : string,
        @Body() updatePollsDto :UpdatePollsDto
    ): Promise<PollsEntity> {
        return this.pollsService.updateSingleResult(id, updatePollsDto);
    }

    @Delete('/:result_id')
    async deleteSingleResult(@Param('result_id') id : string): Promise<PollsEntity> {
        return this.pollsService.deleteSingleResult(id);
    }

    @Get('/tenant/:tenant_id')
    async getResultsByTenanatId(@Param('tenant_id') id : string): Promise<PollsEntity[]> {
        return this.getResultsByTenanatId(id);
    }

    @Get('/agent/:agent_id')
    async getResultsByAgentId(@Param('agent_id') id : string): Promise<PollsEntity[]> {
        return this.pollsService.getResultsByAgentId(id);
    }

    @Patch('/status/:result_id')
    async updatePollStatus( @Param('result_id') id : string): Promise<any> {
        return this.pollsService.updatePollStatus(id);
    }

    @Get('/vote_count/:election_id')
    async voteCount(@Param('result_id') id : string): Promise<any> {
        return this.voteCount(id);
    }
}
