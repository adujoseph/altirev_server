import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import {
    RolesEnum,
    StatusEnum,
    UserEntity,
} from '../../../../users/persistence/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    //if admin exist in db
    const countAdmin = await this.repository.count({
      where: {
        role: RolesEnum.SUPERADMIN,
      },
    });

    //if non create one
    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

            await this.repository.save(
                this.repository.create({
                    firstName: 'Watcher',
                    lastName: 'Overlord',
                    email: 'cybersys101@gmail.com',
                    password,
                    role: RolesEnum.SUPERADMIN,
                    status: StatusEnum.ACTIVE,
                }),
            );
        }

    //check if any user exists in db
    const countUser = await this.repository.count({
      where: {
        role: RolesEnum.USER,
      },
    });

    //if non, create a default user in db
    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

            await this.repository.save(
                this.repository.create({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    password,
                    role: RolesEnum.USER,
                    status: StatusEnum.ACTIVE,
                }),
            );
        }
    }
}
