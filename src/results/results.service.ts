import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultEntity } from './entities/result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResultsService {
    constructor(
        @InjectRepository(ResultEntity)
        private ResultsRepository: Repository<ResultEntity>,
    ) {}
    async create(createResultDto: CreateResultDto) {
        return await this.ResultsRepository.save(createResultDto);
    }

    async findAll() {
        return await this.ResultsRepository.find();
    }

    async findOne(id: string) {
        const election = await this.ResultsRepository.findOneBy({ id });
        if (!election) {
            return `This  #${id} does not exist`;
        }
        return election;
    }

    update(id: number, updateResultDto: UpdateResultDto) {
        return updateResultDto;
    }

    remove(id: number) {
        return `This action removes a #${id} result`;
    }
}
