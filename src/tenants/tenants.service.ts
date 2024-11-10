import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsService {

  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>
  ){}

  async create(createTenantDto: CreateTenantDto) {

    return 'This action adds a new tenant';
  }

  async findAll() {
    return await this.tenantRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
