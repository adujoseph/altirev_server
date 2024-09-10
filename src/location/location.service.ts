import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entity/state.entity';
import { LocalGovernment } from './entity/localgovt.entity';
import { Ward } from './entity/wards.entity';
import { PollingUnit } from './entity/pollingunit.entity';
import { Repository } from 'typeorm';





@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(LocalGovernment)
    private localGovernmentRepository: Repository<LocalGovernment>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
    @InjectRepository(PollingUnit)
    private pollingUnitRepository: Repository<PollingUnit>,
  ) {}

  async seedData(statesData, localGovtsData, wardsData, pollingUnitsData) {
    // Seed States
    const states = await this.stateRepository.save(statesData);

    // Seed Local Govts
    for (const localGovt of localGovtsData) {
      const state = states.find((s) => s.name === localGovt.state);
      await this.localGovernmentRepository.save({ ...localGovt, state });
    }

    // Seed Wards
    for (const ward of wardsData) {
      const localGovernment = await this.localGovernmentRepository.findOne({ where: { name: ward.localGovernment } });
      await this.wardRepository.save({ ...ward, localGovernment });
    }

    // Seed Polling Units
    for (const pollingUnit of pollingUnitsData) {
      const ward = await this.wardRepository.findOne({ where: { name: pollingUnit.ward } });
      await this.pollingUnitRepository.save({ ...pollingUnit, ward });
    }
  }

  // Fetching data
  async getStates(): Promise<State[]> {
    return this.stateRepository.find();
  }

  async getLocalGovernmentsByState(stateId: number): Promise<LocalGovernment[]> {
    // return this.localGovernmentRepository.find({ where: { state: { id: stateId } } });
    return this.localGovernmentRepository.find({ });
  }

  async getWardsByLocalGovernment(lgId: number): Promise<Ward[]> {
    return this.wardRepository.find({ where: { localGovernment: { id: lgId } } });
  }

  async getPollingUnitsByWard(wardId: number): Promise<PollingUnit[]> {
    return this.pollingUnitRepository.find({ where: { ward: { id: wardId } } });
  }
}
