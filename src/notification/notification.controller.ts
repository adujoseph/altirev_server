import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dto/create-pagination.dto';
import { UserRepository } from '../users/persistence/user.repository';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService, private userRepository: UserRepository) {}

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {


        const { createdBy, tenantId } = createNotificationDto;

        // const user = this.userRepository.findByAltirevId(createdBy)
        // console.log(user)

        if (createdBy === 'moderator' && !tenantId) {
          throw new Error('Tenant ID is required for moderator notifications.');
        }
      
        return this.notificationService.createNotification(createNotificationDto);
     
    }

    @Get()
    async findAll(
      @Query() paginationDto: PaginationDto,
      @Query('sortField') sortField: string,
      @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
      @Query('filterField') filterField: string,
      @Query('filterValue') filterValue: string,
      @Query('tenantId') tenantId?: string, // Optional tenant ID
    ) {
      return this.notificationService.getAllNotification(paginationDto, sortField, sortOrder, tenantId, filterField, filterValue);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notificationService.getNotificationById(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ) {
        return this.notificationService.updateNotificationStatus(
            id,
            updateNotificationDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notificationService.deleteNotificationById(id);
    }
}
