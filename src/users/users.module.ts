import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './persistence/relational-persistence.module';
import { FilesModule } from '../files/files.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './persistence/entities/user.entity';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
    imports: [
        infrastructurePersistenceModule,
        FilesModule,
        SubscriptionsModule,
        TypeOrmModule.forFeature([UserEntity])
    ],
    // imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
