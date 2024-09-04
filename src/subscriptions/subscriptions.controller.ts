import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Subscription } from './domain/subscription';
import { AuthGuard } from '@nestjs/passport';
import {
    InfinityPaginationResponse,
    InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSubscriptionsDto } from './dto/find-all-subscriptions.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
    path: 'subscriptions',
    version: '1',
})
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Post('/pay')
    @ApiCreatedResponse({
        type: Subscription,
    })
    create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.subscriptionsService.create(createSubscriptionDto);
    }

    @Get()
    @ApiOkResponse({
        type: InfinityPaginationResponse(Subscription),
    })
    async findAll(
        @Query() query: FindAllSubscriptionsDto,
    ): Promise<InfinityPaginationResponseDto<Subscription>> {
        const page = query?.page ?? 1;
        let limit = query?.limit ?? 10;
        if (limit > 50) {
            limit = 50;
        }

        return infinityPagination(
            await this.subscriptionsService.findAllWithPagination({
                paginationOptions: {
                    page,
                    limit,
                },
            }),
            { page, limit },
        );
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: Subscription,
    })
    findOne(@Param('id') id: string) {
        return this.subscriptionsService.findOne(id);
    }

    @Patch(':id')
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @ApiOkResponse({
        type: Subscription,
    })
    update(
        @Param('id') id: string,
        @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    ) {
        return this.subscriptionsService.update(id, updateSubscriptionDto);
    }

    @Delete(':id')
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    remove(@Param('id') id: string) {
        return this.subscriptionsService.remove(id);
    }
}
