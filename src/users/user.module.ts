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
import { RoleService } from 'src/role/role.service';
import { ConfirmationTokenService } from 'src/auth/confirmationToken/confirmation-token.service';
import { NodeMailerService } from 'src/node-mailer/nodeMailer.service';
import { RequestedPet } from 'src/adoptions/requets/entities/request.entity';
import { RequestModule } from 'src/adoptions/requets/request.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserInformation,
      Role,
      City,
      Pet,
      Adoption,
      ConfirmationToken,
      RequestedPet,
    ])
  ],
  controllers: [UsersController],
  providers: [
    UserService,
    CityService,
    RoleService,
    ConfirmationTokenService,
    NodeMailerService
  ],
  exports : [ UserModule, UserService]
})
export class UserModule { }
