import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserProfile } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserInformation } from './entities/user-information.entity';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { RoleDTO } from 'src/role/dto/role.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @AdminAccess()
  @Post('addUser')
  async getAddUser(@Body() userDTO: CreateUserDTO): Promise<User> {
    return await this.userService.addUser(userDTO);
  }

  @PublicAccess()
  @Post('restore/password')
  async getsentTokenPasswordRestore(@Body() userEmail: LoginDTO): Promise<string> {
    return await this.userService.sentTokenPasswordRestore(userEmail);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get('all')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.allUsers();
  }

  @Roles('ADMIN','USER')
  @Get(':userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: string): Promise<User> {
    return await this.userService.findById(userId);
  }

  @Roles('ADMIN','USER')
  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string): Promise<UserProfile> {
    return await this.userService.findProfile(userId);
  }

  @Roles('USER')
  @Get(':userEmail')
  async getUserByEmail(@Param('userEmail') userEmail: string): Promise<UserInformation> {
    return await this.userService.findEmail(userEmail);
  }

  @Roles('USER','ADMIN')
  @Delete('delete/:userId')
  async getDeleteUser(@Param('userId', ParseIntPipe) userId: string): Promise<string> {
    return await this.userService.deleteUser(userId);
  }

  @PublicAccess()
  @Patch('password/edit')
  async getPasswodRestoration(@Query('reset_password_token') token: string, @Body() newPassword: LoginDTO): Promise<string> {
    return await this.userService.passwordRestoration(token, newPassword);
  }
}
