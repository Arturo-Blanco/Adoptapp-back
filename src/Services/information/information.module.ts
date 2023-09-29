import { Module } from "@nestjs/common";
import { Information } from "./entities/information.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { City } from "src/city/entities/city.entity";
import { InformationType } from "./entities/information.types.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Information, InformationType, City])
    ]
})

export class InformationModule { }