import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/client.dto';
import { Client } from './entities/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) { }

  @Post('addUser/:petId')
  async getAddUser(@Body() clientDTO: CreateClientDTO, @Param('petId', ParseIntPipe) petId: number): Promise<{ status: number, message: string }> {
    return await this.clientService.addUser(clientDTO, petId);
  }

  @Get('all')
  async getAllUsers(): Promise<Client[]> {
    return await this.clientService.allUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: number): Promise<Client> {
    return this.clientService.getUserById(userId);
  }

  @Delete('delete/:userEmail')
  async getDeleteUser(@Param('userEmail') userEmail: string): Promise<string> {
    return await this.clientService.deleteUser(userEmail);
  }

  @Delete('removePet/:userEmail/:petId')
  async getDeletePet(@Param('userEmail') userEmail: string, @Param('petId', ParseIntPipe) petId: number): Promise<string> {
    return this.clientService.removePet(userEmail, petId);
  }
}
