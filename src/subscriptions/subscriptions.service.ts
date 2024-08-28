import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionRepository } from './infrastructure/persistence/subscription.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Subscription } from './domain/subscription';
import process from 'node:process';
import axios from 'axios';
import {
    RegStatus,
    TransactionsEntity,
} from './infrastructure/persistence/relational/entities/transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './infrastructure/persistence/relational/entities/plans.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly subscriptionRepository: SubscriptionRepository,
        @InjectRepository(PlanEntity)
        private planRepository: Repository<PlanEntity>,
        @InjectRepository(TransactionsEntity)
        private transactionRepository: Repository<TransactionsEntity>,
    ) {}

    async create(createSubscriptionDto: CreateSubscriptionDto): Promise<any> {
        const paystackUrl = process.env.PAYSTACK_INITIATE;
        const paystackKey = process.env.PAYSTACK_KEY;
        if (!paystackUrl) {
            throw new BadRequestException('Paystack URL is required');
        }

        try {
            const data = {
                email: createSubscriptionDto.email,
                amount: createSubscriptionDto.amount,
            };

            const config = {
                method: 'post',
                url: paystackUrl,
                data: data,
                headers: {
                    // Authorization: `Bearer ${paystackKey}`,
                    authorization: `Bearer ${paystackKey}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios(config);

            return response.data;
        } catch (error) {
            throw new BadRequestException(error.response);
        }
    }

    async verifyPayment(paymentRef: string): Promise<any> {
        const paystackUrl = process.env.PAYSTACK_VERIFY;
        const paystackKey = process.env.PAYSTACK_KEY;
        if (!paystackUrl) {
            throw new BadRequestException('Paystack URL is required');
        }
        try {
            const response = await axios.get(`${paystackUrl}/${paymentRef}`, {
                headers: {
                    authorization: `Bearer ${paystackKey}`,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache',
                },
            });
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    findAllWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }) {
        return this.subscriptionRepository.findAllWithPagination({
            paginationOptions: {
                page: paginationOptions.page,
                limit: paginationOptions.limit,
            },
        });
    }

    findOne(id: Subscription['id']) {
        return this.subscriptionRepository.findById(id);
    }

    update(
        id: Subscription['id'],
        updateSubscriptionDto: UpdateSubscriptionDto,
    ) {
        return this.subscriptionRepository.update(id, updateSubscriptionDto);
    }

    remove(id: Subscription['id']) {
        return this.subscriptionRepository.remove(id);
    }

    async saveTransaction(planId: string, response: any): Promise<any> {
        try {
            const transaction = new TransactionsEntity();
            transaction.paymentRef = response.reference;
            transaction.paymentData = response;
            transaction.planId = planId;
            transaction.email = response.customer.email;
            transaction.regStatus = RegStatus.COMPLETED;
            transaction.status = response.status;

            return await this.transactionRepository.save(transaction);
        } catch (error) {
            console.log('Error saving Trx :: ', error);
        }
    }
}
