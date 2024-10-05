import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tags } from './entities/tag.entity';
import { Helpers } from '../utils/helper';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(Tags)
    private tagRepository: Repository<Tags>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const existingTag = await this.findByName(createTagDto.name);
    if (existingTag) {
      Helpers.failedHttpResponse("Tag with name already exists", HttpStatus.BAD_REQUEST);
    }
    return this.tagRepository.save(createTagDto);
  }

  findAll() {
    return this.tagRepository.find({});
  }

  findOne(id: string) {
    return this.tagRepository.findOne({where: {id}});
  }

  async findByName(name: string) : Promise<Tags | null> {
    return await this.tagRepository.findOne({where: {name} });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id)
    if (tag && updateTagDto.name !== undefined) {
      tag.name = updateTagDto.name;
      return await this.tagRepository.save(tag);
    }
    Helpers.failedHttpResponse("Tag does not exist", HttpStatus.BAD_REQUEST);
  }

  async remove(id: string) {
    const tag = await this.findOne(id)
    if (!tag){
      Helpers.failedHttpResponse("Tag does not exist", HttpStatus.BAD_REQUEST);
    }
    return this.tagRepository.delete(id);
  }
}
