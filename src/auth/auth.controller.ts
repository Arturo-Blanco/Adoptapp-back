import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "src/users/dto/user.dto";
import { UserInformation } from "src/users/entities/user-information.entity";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() userDTO: CreateUserDTO): Promise<UserInformation> {
        return await this.authService.register(userDTO);
    }

    @Post('login')
    async login(@Body() loginDTO: LoginDTO) : Promise<{ access_token: string }> {
        const valid = await this.authService.validateUser(loginDTO);
        if(!valid) {
            throw new UnauthorizedException('Usuario o contraseña incorrecto.');
        }
        return await this.authService.generateAccessToken(loginDTO.email);
    }
}