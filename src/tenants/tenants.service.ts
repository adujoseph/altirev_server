import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';
import { TenantMapper } from './persistence/mappers/tenant.mappers';

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
    ) {}

    async create(createTenantDto: CreateTenantDto) {
        const tenant = await this.tenantRepository.findOne({
            where: { moderator: createTenantDto.moderatorEmail }
        });
        if (tenant) {
            throw new Error('Tenant already exists');
        }

        return await this.tenantRepository.save(TenantMapper.toPersistence(createTenantDto));
    }

    async findAll() {
        return await this.tenantRepository.find();
    }

    // findOne(id: string) {
    //     return this.tenantRepository.findOne({ where: { id } });
    // }

    update(id: number, updateTenantDto: UpdateTenantDto) {
        return this.tenantRepository.update(id, updateTenantDto);
    }

    remove(id: number) {
        return this.tenantRepository.delete(id);
    }
}
