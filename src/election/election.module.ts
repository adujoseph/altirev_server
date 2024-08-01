import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Election } from './election.entity';
import { ElectionService } from './election.service';
import { ElectionController } from './election.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Election])],
  providers: [ElectionService],
  controllers: [ElectionController],
  exports: [ElectionService],
})
export class ElectionModule {}
