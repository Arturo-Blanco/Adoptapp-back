import { User } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/city/entities/city.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Adoption } from 'src/adoptions/entities/adoptions.entity';
import { UserInformation } from './entities/user-information.entity';
import { Role } from './entities/role.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInformation, Role, City, Pet, Adoption])
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UserModule { }
