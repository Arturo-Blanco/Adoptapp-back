import { City } from 'src/city/entities/city.entity';
import { UserInformation } from 'src/users/entities/user-information.entity';
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { Role } from "src/role/entities/role.entity";
import { AuthService } from "./auth.service";
import { UserService } from "src/users/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CityService } from 'src/city/city.service';
import { User } from 'src/users/entities/user.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { RoleService } from 'src/role/role.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([UserInformation, User, Pet, City, Role]),
                JwtModule.register({
                    global : true,
                    secret: 'LAS PALABRAS USADAS EN UN SECRETO DEBEN SER SECRETAS PARA QUE TU SECRETO NO SEA DESCUBIERTO',
                    signOptions: {expiresIn : "1h"}
                })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, CityService, RoleService]
})
export class AuthModule { }