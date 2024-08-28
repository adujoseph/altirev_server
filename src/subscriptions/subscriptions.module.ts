import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { RelationalSubscriptionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './infrastructure/persistence/relational/entities/subscription.entity';
import { PlanEntity } from './infrastructure/persistence/relational/entities/plans.entity';
import { TransactionsEntity } from './infrastructure/persistence/relational/entities/transactions.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SubscriptionEntity,
            PlanEntity,
            TransactionsEntity,
        ]),
        RelationalSubscriptionPersistenceModule,
    ],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
    exports: [SubscriptionsService, RelationalSubscriptionPersistenceModule],
})
export class SubscriptionsModule {}
