import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RolesEnum, StatusEnum } from '../persistence/entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: 'test1@example.com', type: String })
    @Transform(lowerCaseTransformer)
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @MinLength(6)
    password?: string;

    provider?: string;

    socialId?: string;

    @ApiPropertyOptional({ example: 'John', type: String })
    @IsOptional()
    firstName?: string | null;

    @ApiPropertyOptional({ example: 'Doe', type: String })
    @IsOptional()
    lastName?: string | null;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    photo?: string | null;

    @ApiPropertyOptional({ enum: () => RolesEnum })
    @IsOptional()
    role: RolesEnum;

    @ApiPropertyOptional({ enum: () => StatusEnum })
    @IsOptional()
    status?: StatusEnum;

    hash?: string | null;
}
