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
import { CreateResultsDto, ElectionType } from './dto/create-results.dto';
import { UpdateResultsDto } from './dto/update-results.dto';
import {
  ApiBearerAuth,
  ApiBody,
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

@ApiTags('Results')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'results',
  version: '1',
})
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  // @Post()
  // @ApiCreatedResponse({
  //   type: Results,
  // })
  // create(@Body() createResultsDto: CreateResultsDto) {
  //   return this.resultsService.create(createResultsDto);
  // }

  @ApiCreatedResponse({
    type: Results,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.MulterS3.File,
    @Body() createResultDto: CreateResultsDto,
  ): Promise<Results> {
    console.log({ createResultDto });
    return this.resultsService.create(createResultDto, file);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Results),
  })
  async findAll(
    @Query() query: FindAllResultsDto,
  ): Promise<InfinityPaginationResponseDto<Results>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.resultsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
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
    return this.resultsService.findOne(id);
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
  update(@Param('id') id: string, @Body() updateResultsDto: UpdateResultsDto) {
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
}
