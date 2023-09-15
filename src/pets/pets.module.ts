import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { City } from 'src/city/entities/city.entity';
import { User } from 'src/users/entities/user.entity';
import { Attribute } from './attributes/entities/attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet, City, User, Attribute])
  ],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
