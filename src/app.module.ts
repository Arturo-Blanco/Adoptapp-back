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
import { NodeMailerModule } from './node-mailer/nodeMailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        "type": 'mysql',
        "host": configService.get('DB_HOST'),
        "port": parseInt(configService.get('DB_PORT')),
        "username": configService.get('DB_USER'),
        "password": configService.get('DB_PASSWORD'),
        "database": configService.get('DB_NAME'),
        "entities": [__dirname + "/**/**/**.entity{.ts,.js}"],
        "synchronize": true,
      })
    }),
    PetsModule,
    UserModule,
    ComplaintModule,
    CityModule,
    AttributesModule,
    InformationModule,
    InstitutionModule,
    AuthModule,
    RoleModule,
    NodeMailerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
