import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ApiTags } from '@nestjs/swagger';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
        private s3Service: S3Service,
    ) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    async create(
        @Body() createReportsDto: CreateReportDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Upload a file for evidence');
        }

        const fileUrl = await this.s3Service.uploadFile(file, 'File');
        createReportsDto.fileUrl = fileUrl;     
        return this.reportsService.create(createReportsDto);
    }

    @Get()
    findAll() {
        return this.reportsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reportsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reportsService.remove(id);
    }
}
