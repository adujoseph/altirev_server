import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansEntity } from './plans.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PlansEntity])],
    providers: [PlansService],
    controllers: [PlansController],
})
export class PlansModule {}
