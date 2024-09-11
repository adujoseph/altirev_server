import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entity/state.entity';
import { LocalGovernment } from './entity/localgovt.entity';
import { Ward } from './entity/wards.entity';
import { PollingUnit } from './entity/pollingunit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State, LocalGovernment, Ward, PollingUnit])],
  providers: [LocationService],
  controllers: [LocationController]
})
export class LocationModule {}
