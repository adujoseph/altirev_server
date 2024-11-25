import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollsEntity } from './entities/polls.entity';
import { S3Service } from '../reports/s3.service';

@Module({
  imports: [
       TypeOrmModule.forFeature([PollsEntity]),
        // UsersModule,
        // ReportsModule,
        // forwardRef(() => ElectionModule),
        // RelationalResultsPersistenceModule,
        // TagsModule,
    ],
  controllers: [PollsController],
  providers: [PollsService, S3Service]
})
export class PollsModule {}
