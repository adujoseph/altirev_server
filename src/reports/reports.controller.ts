import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, UploadedFile } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Post()
    create(@Body() createReportsDto: CreateReportDto, @UploadedFile() file: any){

        if(!file) throw new ForbiddenException('Upload your report evidence')
        
        return this.reportsService.create(createReportsDto)
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
