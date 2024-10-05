import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './persistence/relational-persistence.module';
import { FilesModule } from '../files/files.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './persistence/entities/user.entity';
import { StateEntity } from '../results/infrastructure/persistence/relational/entities/state.entity';
import { LgaEntity } from '../results/infrastructure/persistence/relational/entities/lga.entity';
import { WardEntity } from '../results/infrastructure/persistence/relational/entities/ward.entity';
import { PollingEntity } from '../results/infrastructure/persistence/relational/entities/pu.entity';
import { LocationEntity } from '../election/entities/location.entity';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
    imports: [
        infrastructurePersistenceModule,
        FilesModule,
        SubscriptionsModule,
        TypeOrmModule.forFeature([UserEntity, StateEntity, LgaEntity, WardEntity, PollingEntity, LocationEntity]),
    ],
    // imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
