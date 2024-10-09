import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultsDto } from './dto/create-results.dto';
import { UpdateResultsDto } from './dto/update-results.dto';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Results } from './domain/results';
import { AuthGuard } from '@nestjs/passport';
import {
    InfinityPaginationResponse,
    InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllResultsDto } from './dto/find-all-results.dto';
import { FileResponseDto } from '../files/uploader/s3/dto/file-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Helpers } from '../utils/helper';
import { ApiResponse } from '../utils/dto/api.response';

@ApiTags('Results')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
    path: 'results',
    version: '1',
})
export class ResultsController {
    constructor(private readonly resultsService: ResultsService) {}

    @ApiCreatedResponse({
        type: FileResponseDto,
    })
     // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createResultDto: CreateResultsDto,
    ): Promise<ApiResponse> {
        return this.resultsService.create(createResultDto, file);
    }

    @Get()
    @ApiOkResponse({
        type: InfinityPaginationResponse(Results),
    })
    async findAll(@Query() query: FindAllResultsDto): Promise<ApiResponse> {
        const page = query?.page ?? 1;
        let limit = query?.limit ?? 10;
        if (limit > 50) {
            limit = 50;
        }

        return Helpers.success(
            infinityPagination(
                await this.resultsService.findAllWithPagination({
                    paginationOptions: {
                        page,
                        limit,
                    },
                }),
                { page, limit },
            ),
        );
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: Results,
    })
    findOne(@Param('id') id: string) {
        return Helpers.success(this.resultsService.findOne(id));
    }

    @Get('tenant/:tenantId')
    @ApiParam({
        name: 'tenantId',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: Results,
    })
    findTenantResults(@Param('tenantId') tenantId: string) {
        return this.resultsService.getResultByTenant(tenantId);
    }

    @Patch(':id')
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: Results,
    })
    update(
        @Param('id') id: string,
        @Body() updateResultsDto: UpdateResultsDto,
    ) {
        return this.resultsService.update(id, updateResultsDto);
    }

    @Delete(':id')
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    remove(@Param('id') id: string) {
        return this.resultsService.remove(id);
    }

    @Get('agents/:agentId')
    @ApiParam({ name: 'agentId' })
    @ApiOkResponse({ type: Results })
    async getResultByAgent(@Param('agentId') agentId: string) {
        return await this.resultsService.getResultByAgent(agentId);
    }

    @Get('tenant/:tenantId')
    @ApiParam({ name: 'tenantId' })
    @ApiOkResponse({ type: Results })
    async getResultByTenant(@Param('tenantId') tenantId: string) {
        return await this.resultsService.getResultByTenant(tenantId);
    }

    @Get('location/seed')
    async getJSONData() {
        await this.resultsService.doData();
    }

    @Get('public/countries')
    async getCountries() {
        return await this.resultsService.getCountries();
    }

    // pi.altirev.com/api/public/{countryId}/states
    @Get('public/:countryId/states')
    @ApiParam({ name: 'countryId', type: String, required: true })
    async getStates(@Param('countryId') countryId: string) {
        return await this.resultsService.getAllStates(countryId);
    }

    // api.altirev.com/api/public/{stateId}/localgovt
    @Get('public/:stateId/localgovt')
    @ApiParam({ name: 'stateId', type: String, required: true })
    async getLgas(@Param('stateId') stateId: string) {
        return await this.resultsService.getAllLgas(stateId);
    }

    // api.altirev.com/api/public/{localGovtId}/wards
    @Get('public/:lgaId/wards')
    @ApiParam({ name: 'lgaId', type: String, required: true })
    async getWards(@Param('lgaId') lgaId: string) {
        return await this.resultsService.getAllWards(lgaId);
    }

    // api.altirev.com/api/public/{wardId}/pu
    @Get('public/:wardId/pu')
    @ApiParam({ name: 'wardId', type: String, required: true })
    async getPollingUnits(@Param('wardId') wardId: string) {
        return await this.resultsService.getAllPU(wardId);
    }

    //only Moderator or Comms should be able to access route
    @Patch("/modify/status")
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: Results,
    })
    async approveReject(
      @Param('id') id: string,
      @Body() updateResultsDto: UpdateResultsDto,
    ) {
        return await this.resultsService.approveRejectResult(id, updateResultsDto);
    }

    //TODO : only comms should have access to this endpoint
    @Patch(":resultId/tags")
    @ApiOkResponse({
        type: Results,
    })
    @ApiParam({
        name: 'resultId',
        type: String,
        required: true,
    })
    async tagResults(@Param('resultId') resultId: string, @Body() tagsId: string[]) {
        return await this.resultsService.addTagsToResults(resultId, tagsId);
    }
}
