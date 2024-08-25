import { Module } from '@nestjs/common';
import { ResultsRepository } from '../results.repository';
import { ResultsRelationalRepository } from './repositories/results.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsEntity } from './entities/results.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResultsEntity])],
  providers: [
    {
      provide: ResultsRepository,
      useClass: ResultsRelationalRepository,
    },
  ],
  exports: [ResultsRepository],
})
export class RelationalResultsPersistenceModule {}
