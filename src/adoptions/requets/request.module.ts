import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { RequestedPet } from './entities/request.entity';
import { RequestPetController } from './request.controller';
import { RequestedPetsService } from './request.service';
import { PetsModule } from 'src/pets/pets.module';
import { UserModule } from 'src/users/user.module';
import { Pet } from 'src/pets/entities/pet.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [
        PetsModule,
        UserModule,
        TypeOrmModule.forFeature([RequestedPet, Pet, User])],
    controllers: [RequestPetController],
    providers: [RequestedPetsService],
    exports: [RequestModule]
})
export class RequestModule { }