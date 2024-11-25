import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePollsDto } from './dto/create-polls.dto';
import { PollsEntity } from './entities/polls.entity';
import { S3Service } from '../reports/s3.service';
import { UpdatePollsDto } from './dto/update-polls.dto';

@Injectable()
export class PollsService {
 constructor(
        @InjectRepository(PollsEntity)
        private readonly pollsRepository: Repository<PollsEntity>,
        private s3Service: S3Service,
    ) {}


    async postResults( createPollsDto: CreatePollsDto, file: Express.Multer.File): Promise<PollsEntity> {

        if (!file) {
            throw new BadRequestException('Upload a file for evidence');
        }

        const fileUrl = await this.s3Service.uploadFile(
            file,
            file.buffer,
            'File',
        );

        return await this.pollsRepository.save({...createPollsDto, fileUrl});
    }

 
    async getResults(): Promise<PollsEntity[] | any[]> {
        return await this.pollsRepository.find({});
    }

    
    async getSingleResult(id: string): Promise<PollsEntity | any> {
        return await this.pollsRepository.findOne({
            where: {id}
        });
    }

   
    async updateSingleResult(id: string, updatePollsDto: UpdatePollsDto): Promise<PollsEntity | any> {
        const poll =  await this.pollsRepository.findOne({
            where: {id}
        });

        return updatePollsDto
    }

   
    async deleteSingleResult(id: string): Promise<PollsEntity | any> {
        return {};
    }

 
    async getResultsByTenanatId(): Promise<PollsEntity[] | any[]> {
        return [];
    }

   
    async getResultsByAgentId(id: string): Promise<PollsEntity[] | any[]> {
        this.pollsRepository.find({
            where:{}
        })
        return [];
    }

  
    async updatePollStatus(id: string): Promise<any> {
        return {};
    }

   
    async voteCount(): Promise<any> {
        return {};
    }
}
