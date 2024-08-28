import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlansDto } from './dto/create-plans.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Plans')
@Controller('plans')
export class PlansController {
    constructor(
        private readonly planService: PlansService
    ) {}

    @Post()
    create(@Body() createPlansDto: CreatePlansDto) {
        return this.planService.createPlans(createPlansDto);
    }

    @Get()
    getList() {
        return this.planService.getPlans();
    }

    @Delete(':id')
    removePlan(@Param('id') id: string){
        return this.planService.deletePlan(id)
    }
}
