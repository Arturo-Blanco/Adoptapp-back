import { UserModule } from './users/user.module';
import { Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module';
import { ComplaintModule } from './complaint/complaint.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './city/city.module';
import { AttributesModule } from './pets/attributes/attributes.module';
import { InformationModule } from './information/information.module';
import { InstitutionModule } from './institutions/institutions.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';

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
    PetsModule,
    UserModule,
    ComplaintModule, 
    CityModule, 
    AttributesModule, 
    InformationModule,
    InstitutionModule,
    AuthModule,
    RoleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
