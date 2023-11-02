import { Client } from './entities/client.entity';
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientsController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/city/entities/city.entity';
import { Pet } from 'src/pets/entities/pet.entity';
import { Adoption } from 'src/adoptions/entities/adoptions.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, User,City, Pet, Adoption])
  ],
  controllers: [ClientsController],
  providers: [ClientService],
})
export class ClientsModule { }
