import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserInformation } from './entities/user-information.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Post('addUser')
  async getAddUser(@Body() userDTO: CreateUserDTO): Promise<User> {
    return await this.userService.addUser(userDTO);
  }

  @Get('all')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.allUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return await this.userService.findById(userId);
  }

  @Get(':userEmail')
  async getUserByEmail(@Param('userEmail') userEmail: string): Promise<UserInformation> {
    return await this.userService.findEmail(userEmail);
  }

  @Delete('delete/:userEmail')
  async getDeleteUser(@Param('userEmail') userEmail: string): Promise<string> {
    return await this.userService.deleteUser(userEmail);
  }

  @Delete('removePet/:userEmail/:petId')
  async getDeletePet(@Param('userEmail') userEmail: string, @Param('petId', ParseIntPipe) petId: number): Promise<string> {
    return await this.userService.removePet(userEmail, petId);
  }
}
