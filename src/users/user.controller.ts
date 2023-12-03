import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserWithPet } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserInformation } from './entities/user-information.entity';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { RoleDTO } from 'src/role/dto/role.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Post('addUser')
  async getAddUser(@Body() userDTO: CreateUserDTO): Promise<User> {
    return await this.userService.addUser(userDTO);
  }

  @PublicAccess()
  @Post('addPet')
  async getAddPet(@Body() body: UserWithPet): Promise<{ status: number, message: string }> {
    return await this.userService.addPet(body)
  }

  @PublicAccess()
  @Post('restore/password')
  async getRestorePass(@Body() userEmail  : LoginDTO): Promise<string> {
    return await this.userService.restorePass(userEmail);
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


  @Delete('removePet')
  async getDeletePet(@Body() body: UserWithPet): Promise<string> {
    return await this.userService.removePet(body);
  }

  @AdminAccess()
  @Patch('updateRole/:userId')
  async getUpdateRole(@Param('userId', ParseIntPipe) userId: number, @Body() role: RoleDTO): Promise<string> {
    return await this.userService.changeRole(userId, role);
  }

  @PublicAccess()
  @Patch('password/edit')
  async getChangePassword(@Query('reset_password_token') token: string, @Body() newPassword: LoginDTO): Promise<string> {
      return await this.userService.changePassword(token, newPassword)
  }
}
