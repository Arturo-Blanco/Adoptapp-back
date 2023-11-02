import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Adoption } from 'src/adoptions/entities/adoptions.entity';
import { Complaint } from 'src/complaint/entities/complaint.entity';
import { Information } from 'src/information/entities/information.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([City, Pet, Client, Adoption, Complaint, Information])
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
