import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
    NoteCategory,
    NotificationEntity,
} from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../users/persistence/user.repository';
import { RolesEnum } from '../users/persistence/entities/user.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private NotificationRepsository: Repository<NotificationEntity>,
        private userRepository: UserRepository,
    ) {}

    async createNotification(createNotificationDto: CreateNotificationDto) {
        const { createdBy } = createNotificationDto;

        if (!createdBy) {
            throw new ForbiddenException('Access denied');
        }

        const user = await this.userRepository.findByAltirevId(createdBy);

        if (!user) {
            throw new ForbiddenException('Access denied');
        }
        if (
            user.role !== RolesEnum.ADMIN &&
            user.role !== RolesEnum.MODERATOR
        ) {
            throw new ForbiddenException('Access denied');
        }

        if (user.role === RolesEnum.MODERATOR) {
            createNotificationDto.category = NoteCategory.Specific;
            createNotificationDto.tenantId = user.tenantId;
        }

        console.log({ user });

        const newTask = await this.NotificationRepsository.save(
            createNotificationDto,
        );
        return newTask;
    }

    async getAllNotification() {
        const tasks = await this.NotificationRepsository.find();
        return tasks;
    }

    async getNotificationById(id: string): Promise<NotificationEntity> {
        const found = await this.NotificationRepsository.findOneBy({ id });
        if (!found) {
            throw new NotFoundException(
                `Notification with ID ${id} is not found`,
            );
        } else {
            return found;
        }
    }

    async deleteNotificationById(id: string): Promise<void> {
        const result = await this.NotificationRepsository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} is not found`);
        }
    }

    async updateNotificationStatus(
        id: string,
        updateNotificationDto: UpdateNotificationDto,
    ) {
        const task = await this.getNotificationById(id);
        if (task) {
            await this.NotificationRepsository.save(updateNotificationDto);
            return task;
        }
        throw new NotFoundException(`Notification with ID ${id} is not found`);
    }
}
