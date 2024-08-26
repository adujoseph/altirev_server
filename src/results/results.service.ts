import { Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
    create(createResultDto: CreateResultDto) {
        return createResultDto;
    }

    findAll() {
        return `This action returns all results`;
    }

    findOne(id: number) {
        return `This action returns a #${id} result`;
    }

    update(id: number, updateResultDto: UpdateResultDto) {
        return updateResultDto;
    }

    remove(id: number) {
        return `This action removes a #${id} result`;
    }
}
