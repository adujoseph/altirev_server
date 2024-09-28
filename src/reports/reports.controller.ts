import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
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
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { promisify } from 'util';
import { ChangeReportStatusDto } from './dto/change-report-status.dto';
import { SuspendUserDto } from './dto/suspend-user.dto';


const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const readFileAsync = promisify(fs.readFile);
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

        const fileUrl = await this.s3Service.uploadFile(
            file,
            file.buffer,
            'File',
        );
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
            const watermarkedImage = await this.watermarkImage(file);
            fileUrl = await this.s3Service.uploadFile(file, watermarkedImage, 'Images');
        }

        if(file.mimetype.startsWith('video')){
            const watermarkedVideo = await this.watermarkVideo2(file);
            fileUrl = await this.s3Service.uploadFile(file, watermarkedVideo, 'Video');
        }
     
        return {
            message: 'file uploaded successfully',
            fileUrl,
        };
    }

    private async watermarkImage(file: Express.Multer.File): Promise<Buffer> {
        const watermarkPath = path.join(
            __dirname,
            '..',
            '..',
            'src',
            'public',
            'watermarks',
            'watermark.png',
        );

        const watermark = await sharp(watermarkPath)
            .resize(384 / 2, 156 / 2)
            .ensureAlpha(0.7)
            .toBuffer();

        return await sharp(file.buffer)
            .composite([{ input: watermark, gravity: 'northwest' }])
            .toBuffer();
    }

    private async watermarkVideo2(file: Express.Multer.File): Promise<Buffer> {
        const tempDir = './temp';
        const inputPath = path.join(tempDir, file.originalname);
        const outputPath = path.join(tempDir, `watermarked_${file.originalname}`);
        const watermarkPath = path.join(__dirname, '..', '..', 'src', 'public', 'watermarks', 'watermark.png');

        // Ensure temp directory exists
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Save the uploaded video temporarily
        await writeFileAsync(inputPath, file.buffer);

    
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
            .input(watermarkPath)
            .complexFilter('overlay=W-w-10:H-h-10') // Overlay bottom-right
            .output(outputPath)
            .on('end', async () => {
                try {
                    // Read the watermarked video
                    const watermarkedVideo = await readFileAsync(outputPath);

                    // Clean up temporary files
                    await unlinkAsync(inputPath);
                    await unlinkAsync(outputPath);

                    resolve(watermarkedVideo);
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                reject(err);
            })
            .run();
        });
    }


    @Post('/submit-report')
    async createReport(@Body() createReportsDto: CreateReportDto) {
        return this.reportsService.create(createReportsDto);
    }

    @Get('escalated')
    async findEscalated() {
       return this.reportsService.getEscalatedElections()
    }

    @Get()
    findAll() {
        return this.reportsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reportsService.findOne(id);
    }

   

    @Get('/me/:userId')
    findMe(@Param('id') id: string) {
       return this.reportsService.findMe(id)
    }

    @Get('/tenant/:id')
    findReportByTenanant(@Param('id') id: string) {
       return this.reportsService.findReportTenant(id)
    }
    @Get('/agents/:tenantId')
    agentsStatus(@Param('tenantId') id: string) {
       return this.reportsService.agentStatusByTenant(id)
    }

    @Patch('suspend-user')
    suspendUser( @Body() suspendUserDto: SuspendUserDto){
        return this.reportsService.suspend(suspendUserDto)
    }


    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @Patch('change-status/:id')
    async changeReport(
        @Param('id') id: string,
        @Body() changeReportStatusDto: ChangeReportStatusDto,
    ) {
       return this.reportsService.chanegStatus(id, changeReportStatusDto)
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
