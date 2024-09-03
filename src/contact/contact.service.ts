import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactEntity } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(ContactEntity)
        private contactRepository: Repository<ContactEntity>,
    ) {}
    async create(createContactDto: CreateContactDto) {
        return await this.contactRepository.save(createContactDto);
    }

    async findAll() {
        return await this.contactRepository.find();
    }

    async findOne(id: string) {
        const contact_message = await this.contactRepository.findOne({
            where: { id },
        });
        if (!contact_message) {
            throw new BadRequestException();
        }
        return contact_message;
    }

    update(id: number, updateContactDto: UpdateContactDto) {
        return `This action updates a #${id} contact on ${updateContactDto}`;
    }

    remove(id: number) {
        return `This action removes a #${id} contact`;
    }
}
