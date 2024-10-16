import { forwardRef, Module } from '@nestjs/common';
import { ElectionResultsController } from './election-results.controller';
import { ElectionResultsService } from './election-results.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectionResultsEntity } from './entities/election-results.entity';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
import { ElectionModule } from '../election/election.module';
import { TagsModule } from '../tags/tags.module';
import { RelationalResultsPersistenceModule } from '../results/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectionResultsEntity]),
    UsersModule,
    ReportsModule,
    forwardRef(() => ElectionModule),
    RelationalResultsPersistenceModule,
    TagsModule
  ],
  controllers: [ElectionResultsController],
  providers: [ElectionResultsService]
})
export class ElectionResultsModule {}
