import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../../roles/persistence/entities/role.entity';
import { RoleEnum } from '../../../../roles/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.user,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.user,
          name: 'User',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: 'Admin',
        }),
      );
    }

    const countSuperAdmin = await this.repository.count({
      where: {
        id: RoleEnum.superadmin,
      },
    });

    if (!countSuperAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.superadmin,
          name: 'superadmin',
        }),
      );
    }

    const countModerator = await this.repository.count({
      where: {
        id: RoleEnum.moderator,
      },
    });

    if (!countModerator) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.moderator,
          name: 'moderator',
        }),
      );
    }

    const countComm = await this.repository.count({
      where: {
        id: RoleEnum.comm,
      },
    });

    if (!countComm) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.comm,
          name: 'comm',
        }),
      );
    }

    const countAgents = await this.repository.count({
      where: {
        id: RoleEnum.agent,
      },
    });

    if (!countAgents) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.agent,
          name: 'agent',
        }),
      );
    }
  }
}
