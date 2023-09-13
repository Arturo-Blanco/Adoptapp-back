import { User } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/city/entities/city.entity';
import { Pet } from 'src/pets/entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,City, Pet])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
