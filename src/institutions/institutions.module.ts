import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Institution } from "./entities/institution.entity";
import { City } from "src/city/entities/city.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { InstitutionController } from "./institutions.controller";
import { InstitutionService } from "./institutions.service";
import { CityService } from "src/city/city.service";

@Module({
    imports : [
        TypeOrmModule.forFeature([Institution, City, Pet])
    ],
    controllers : [InstitutionController],
    providers : [InstitutionService, CityService]
})
export class InstitutionModule {}