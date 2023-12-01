import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/role/entities/role.entity";

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @MinLength(8)
    readonly password : string;

    readonly roleId? : Role;
}