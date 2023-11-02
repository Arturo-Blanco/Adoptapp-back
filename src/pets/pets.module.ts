import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { City } from 'src/city/entities/city.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Attribute } from './attributes/entities/attribute.entity';
import { Adoption } from 'src/adoptions/entities/adoptions.entity';
import { Institution } from 'src/institutions/entities/institution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet, City, Institution, Client, Attribute, Adoption])
  ],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
