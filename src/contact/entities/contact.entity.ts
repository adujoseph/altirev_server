import { IsNotEmpty } from 'class-validator';
export class Contact {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    message: string;
}
