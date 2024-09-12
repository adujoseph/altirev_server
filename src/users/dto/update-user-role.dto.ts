import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    // decorators here
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import {
    Gender,
    RolesEnum,
    StatusEnum,
} from '../persistence/entities/user.entity';

export class UpdateUserRoleDto {
    @ApiProperty({ example: 'test1@example.com', type: String })
    @Transform(lowerCaseTransformer)
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'bambam', type: String })
    @IsNotEmpty()
    polling_unit: string | null;

    @ApiProperty({ example: '+234980778697', type: String })
    @IsNotEmpty()
    local_govt: string | null;

    @ApiProperty({ enum: () => Gender })
    @IsNotEmpty()
    ward: string;

    @ApiProperty({ example: 'Abuja', type: String })
    @IsNotEmpty()
    state: string | null;


    @ApiPropertyOptional({ enum: RolesEnum })
    @IsEnum(RolesEnum)
    role: RolesEnum;

    @ApiProperty()
    @IsNotEmpty()
    moderator_tenant_id: string
}
