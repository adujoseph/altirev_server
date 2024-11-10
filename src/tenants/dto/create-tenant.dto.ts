import { IsNotEmpty } from "class-validator";

export class CreateTenantDto {
    @IsNotEmpty()
    private name: string;

    @IsNotEmpty()
    private moderatorEmail: string;

    @IsNotEmpty()
    private userCount: string;
}
