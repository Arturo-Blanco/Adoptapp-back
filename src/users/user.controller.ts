import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserInformation } from './entities/user-information.entity';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { RoleDTO } from 'src/role/dto/role.dto';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
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

  @AdminAccess()
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

  @PublicAccess()
  @Patch('updateRole/:userId')
  async getUpdateRole(@Param('userId', ParseIntPipe) userId: number, @Body() role: RoleDTO): Promise<string> {
    return await this.userService.changeRole(userId, role);
  }
}
