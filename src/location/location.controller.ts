import { Controller, Get, Param, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('seed')
  async seedLocationData() {
    const statesData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/location/jsons/states.json'), 'utf-8')
      );
    const localGovtsData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/location/jsons/local-governments.json'), 'utf-8')
      );
      console.log({localGovtsData})
    const wardsData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/location/jsons/wards.json'), 'utf-8')
      );

      console.log({wardsData})
    const pollingUnitsData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'src/location/jsons/polling-units.json'), 'utf-8')
      );
      console.log({pollingUnitsData})
    await this.locationService.seedData(statesData, localGovtsData, wardsData, pollingUnitsData);
    return { message: 'Data seeded successfully' };
  }

  @Get('states')
  async getStates() {
    return this.locationService.getStates();
  }

  @Get('local-governments/:stateId')
  async getLocalGovernmentsByState(@Param('stateId') stateId: number) {
    return this.locationService.getLocalGovernmentsByState(stateId);
  }

  @Get('wards/:lgId')
  async getWardsByLocalGovernment(@Param('lgId') lgId: number) {
    return this.locationService.getWardsByLocalGovernment(lgId);
  }

  @Get('polling-units/:wardId')
  async getPollingUnitsByWard(@Param('wardId') wardId: number) {
    return this.locationService.getPollingUnitsByWard(wardId);
  }
}
