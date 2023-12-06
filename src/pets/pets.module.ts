import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { City } from 'src/city/entities/city.entity';
import { User } from 'src/users/entities/user.entity';
import { Attribute } from './attributes/entities/attribute.entity';
import { Adoption } from 'src/adoptions/entities/adoptions.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { ImageService } from 'src/Sharp/image.service';
import { FirebaseStorageService } from 'src/Firebase/firebase.service';
import { UserService } from 'src/users/user.service';
import { CityService } from 'src/city/city.service';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Pet, City, Institution, User, Attribute, Adoption])
  ],
  controllers: [PetsController],
  providers: [PetsService, ImageService, FirebaseStorageService],
})
export class PetsModule {}
