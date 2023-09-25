import { Module } from "@nestjs/common";
import { Information } from "./entities/information.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { City } from "src/city/entities/city.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Information, City])
    ]
})

export class InformationModule{}