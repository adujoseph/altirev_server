import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Election } from './entities/election.entity';
import { ElectionService } from './election.service';
import { ElectionController } from './election.controller';
import { LocationEntity } from './entities/location.entity';
import { ResultsModule } from '../results/results.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Election, LocationEntity]),
        forwardRef(() => ResultsModule),
        UsersModule,
    ],
    providers: [ElectionService],
    controllers: [ElectionController],
    exports: [ElectionService, TypeOrmModule],
})
export class ElectionModule {}
