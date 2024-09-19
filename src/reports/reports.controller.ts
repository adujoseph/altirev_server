import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportEntity } from './reports.entity';
import sharp from 'sharp';
import * as path from 'path';

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

        const fileUrl = await this.s3Service.uploadFile(file, file.buffer, 'File');
        createReportsDto.fileUrl = fileUrl;
        return this.reportsService.create(createReportsDto);
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    @Post('/file-upload')
    async createFileUpload(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Upload a file for evidence');
        }

      
        let fileUrl;

        if(file.mimetype.startsWith('image')){
            const watermarkPath = path.join(__dirname, '..','..','src', 'public', 'watermarks', 'watermark.png');

            const watermark = await sharp(watermarkPath).resize(384/2, 156/2).ensureAlpha(0.7).toBuffer();

            const watermarkedImage = await sharp(file.buffer)
              .composite([{ input: watermark, gravity: 'northwest' }])
              .toBuffer();

            fileUrl = await this.s3Service.uploadFile(file, watermarkedImage, 'Images');
        }

        if(file.mimetype.startsWith('video')){
            //handle video
        }
       // const fileUrl = await this.s3Service.uploadFile(file, 'File');

        return {
            message: 'file uploaded successfully',
            fileUrl,
        };
    }

    @Post('/submit-report')
    async createReport(@Body() createReportsDto: CreateReportDto) {
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

    @Patch(':id')
    async updateReport(
        @Param('id') id: string,
        @Body() updateReportDto: UpdateReportDto,
    ): Promise<ReportEntity> {
        return this.reportsService.updateReport(id, updateReportDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reportsService.remove(id);
    }
}
