import { IsNotEmpty } from 'class-validator';

export class CreateTenantDto {
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public moderatorEmail: string;

    @IsNotEmpty()
    public userCount: number;
}
