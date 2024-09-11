import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { RolesEnum } from '../../users/persistence/entities/user.entity';

export class CreateLocationDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    state: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    lga: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    ward: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    pollingUnit: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    user: string;

    @ApiProperty({ enum: () => RolesEnum })
    @IsOptional()
    role: RolesEnum;
}
