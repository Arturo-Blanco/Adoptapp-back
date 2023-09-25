import { Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module';
import { UsersModule } from './users/users.module';
import { ComplaintModule } from './Services/complaint/complaint.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './city/city.module';
import { AttributesModule } from './pets/attributes/attributes.module';
import { InformationModule } from './Services/information/information.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "adoptapp",
      "database": "adoptapp_db",
      "entities": [__dirname + "/**/**/**.entity{.ts,.js}"],
      "synchronize": true,
    }),
    PetsModule, UsersModule, ComplaintModule, CityModule, AttributesModule, InformationModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
