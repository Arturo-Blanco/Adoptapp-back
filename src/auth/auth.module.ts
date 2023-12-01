import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from "./auth.controller";

import { User } from 'src/users/entities/user.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Role } from "src/role/entities/role.entity";
import { City } from 'src/city/entities/city.entity';
import { UserInformation } from 'src/users/entities/user-information.entity';

import { NodeMailerService } from 'src/node-mailer/nodeMailer.service';
import { RoleService } from 'src/role/role.service';
import { CityService } from 'src/city/city.service';
import { AuthService } from "./auth.service";
import { UserService } from "src/users/user.service";
import { ConfirmationTokenService } from "./confirmationToken/confirmation-token.service";
import { ConfirmationToken } from "./confirmationToken/entities/confirmation-token.entity";
import { ConfirmationTokenController } from "./confirmationToken/confirmation-token.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserInformation, User, Pet, City, Role, ConfirmationToken]),
    JwtModule.register({
        global: true,
        secret: 'LAS PALABRAS USADAS EN UN SECRETO DEBEN SER SECRETAS PARA QUE TU SECRETO NO SEA DESCUBIERTO',
        signOptions: { expiresIn: "60s" }
    })
    ],
    controllers: [AuthController, ConfirmationTokenController],
    providers: [
        AuthService,
        UserService,
        CityService,
        RoleService,
        NodeMailerService,
        ConfirmationTokenService
    ]
})
export class AuthModule { }