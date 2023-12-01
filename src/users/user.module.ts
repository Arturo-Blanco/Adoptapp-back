import { User } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/city/entities/city.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Adoption } from 'src/adoptions/entities/adoptions.entity';
import { UserInformation } from './entities/user-information.entity';
import { Role } from '../role/entities/role.entity';
import { CityService } from 'src/city/city.service';
import { ConfirmationToken } from 'src/auth/confirmationToken/entities/confirmation-token.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInformation, Role, City, Pet, Adoption, ConfirmationToken])
  ],
  controllers: [UsersController],
  providers: [UserService, CityService],
})
export class UserModule { }
