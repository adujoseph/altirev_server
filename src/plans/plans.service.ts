import { Injectable } from '@nestjs/common';
import { PlansEntity } from './plans.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlansDto } from './dto/create-plans.dto';

@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(PlansEntity)
        private PlansRepository: Repository<PlansEntity>,
    ) {}

    async createPlans(createPlansDto: CreatePlansDto): Promise<PlansEntity> {
        const newPlans = await this.PlansRepository.save(createPlansDto);
        return newPlans;
    }

    async getPlans(): Promise<PlansEntity[]> {
        return await this.PlansRepository.find();
    }

    async deletePlan(id: string) {
        return await this.PlansRepository.delete(id).then(() => {});
    }
}
