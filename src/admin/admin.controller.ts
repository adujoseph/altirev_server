import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  createAdminUser(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdminUser(createAdminDto);
  }

  @Get()
  getAllAdminUsers() {
    return this.adminService.getAllAdminUsers();
  }

  @Get(':id')
  getAdminUserById(@Param('id') id: string) {
    return this.adminService.getAdminUserById(+id);
  }

  @Patch(':id')
  updateAdminDetails(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.updateAdminDetails(+id, updateAdminDto);
  }

  @Post(':id')
  suspendAdminUser(@Param('id') id: string) {
    return this.adminService.suspendAdmin(+id);
  }
}
