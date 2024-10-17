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
    HttpStatus,
    HttpCode,
    SerializeOptions,
    UseInterceptors,
    UploadedFile,
    Res,
    StreamableFile,
    Header,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import {
    InfinityPaginationResponse,
    InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './domain/user';
import { UsersService } from './users.service';
import { infinityPagination } from '../utils/infinity-pagination';
import { RolesEnum } from './persistence/entities/user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Helpers } from '../utils/helper';

// @ApiBearerAuth()
// @Roles(RolesEnum.ADMIN)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Users')
@Controller({
    path: 'users',
    version: '1',
})
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiCreatedResponse({
        type: User,
    })
    @SerializeOptions({
        groups: ['admin'],
    })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createProfileDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createProfileDto, '');
    }

    @ApiOkResponse({
        type: InfinityPaginationResponse(User),
    })
    @SerializeOptions({
        groups: ['admin'],
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query() query: QueryUserDto,
    ): Promise<InfinityPaginationResponseDto<User>> {
        const page = query?.page ?? 1;
        let limit = query?.limit ?? 10;
        if (limit > 50) {
            limit = 50;
        }

        return infinityPagination(
            await this.usersService.findManyWithPagination({
                filterOptions: query?.filters,
                sortOptions: query?.sort,
                paginationOptions: {
                    page,
                    limit,
                },
            }),
            { page, limit },
        );
    }

    @ApiOkResponse({
        type: Array<User>,
    })
    @Get('tenant/:tenantId')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'tenantId',
        type: String,
        required: true,
    })
    async findAllTenantUsers(
        @Param('tenantId') tenantId: User['tenantId'],
    ): Promise<NullableType<User[]>> {
        return this.usersService.findByTenant(tenantId);
    }

    @ApiOkResponse({
        type: User,
    })
    @SerializeOptions({
        groups: ['admin'],
    })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
        return this.usersService.findById(id);
    }

    @ApiOkResponse({
        type: User,
    })
    @SerializeOptions({
        groups: ['admin'],
    })
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    update(
        @Param('id') id: User['id'],
        @Body() updateProfileDto: UpdateUserDto,
    ): Promise<User | null> {
        return this.usersService.update(id, updateProfileDto);
    }

    // @Post('/role')
    // updateRole(@Body() updateRoleDto: UpdateUserRoleDto): Promise<any> {
    //     return this.usersService.updateRole(updateRoleDto);
    // }

    @Get('/userWithLocation/:userId')
    async getUserWithLocation(@Param('userId') userId: string) {
        return this.usersService.getUserWithLocation(userId);
    }

    @Delete(':id')
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: User['id']): Promise<void> {
        return this.usersService.remove(id);
    }

    @Post('/bulk/:tenantId/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiParam({
        name: 'tenantId',
        type: String,
        required: true,
    })
    @Header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    @Header('Content-Disposition', 'attachment; filename=Failed Data.xlsx')
    async uploadFile(
        @UploadedFile() file,
        @Param('tenantId') tenantId: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<any> {
        // file is the uploaded file
        const result = await this.usersService.processBulkUserUpload(
            file,
            tenantId,
        );
        if (result !== 'success') {
            res.send(result);
            // const file = createReadStream(result);
            // return new StreamableFile(file, {
            //     type: 'application/json',
            //     disposition: 'attachment; filename="Failed Data.xlsx"',
            // });
            // const file = createReadStream(join(process.cwd(), 'Failed Data.xlsx'));
            // res.headers.set('Content-Type', 'application/json');
            // res.headers.set('Content-Disposition', 'attachment; filename="Failed Data.xlsx"');
            // // res.headers.set({
            // //     'Content-Type': 'application/json',
            // //     'Content-Disposition': 'attachment; filename="package.json"',
            // // });
            // return new StreamableFile(file);
        } else {
            return Helpers.success('Agents Uploaded Successfully');
        }
    }
}
