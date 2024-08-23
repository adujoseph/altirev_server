import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminStatus } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private AdminRepsository: Repository<AdminEntity>,
  ) {}

  async createAdminUser(createAdminDto: any) {
    const { username, password, status } = createAdminDto;
    const new_user = { username, password, status };
    await this.AdminRepsository.save(createAdminDto);
    return new_user;
  }

  async getAllAdminUsers() {
    const admins = await this.AdminRepsository.find();
    return admins;
  }

  async getAdminUserById(id: string) {
    const found = await this.AdminRepsository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Admin with ID ${id} is not found`);
    } else {
      return found;
    }
  }

  async updateAdminDetails(id: string, updateAdminDto: UpdateAdminDto) {
    const found = await this.getAdminUserById(id);
    const updatedAdmin = { ...found, updateAdminDto };
    await this.AdminRepsository.save(updatedAdmin);
    return updatedAdmin;
  }

  async suspendAdmin(id: string) {
    const found = await this.getAdminUserById(id);
    found.status = AdminStatus.Inactive;
    await this.AdminRepsository.save(found);
    return found;
  }
}
