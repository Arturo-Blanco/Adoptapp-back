import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDTO, PetDTO, UpdatePetDTO } from './dto/pet.dto';
import { Pet } from './entities/pet.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('pets')
@UseGuards(AuthGuard, RolesGuard)
export class PetsController {
    constructor(private readonly petsService: PetsService) { }

    @PublicAccess()
    @Get('count')
    async getCount(): Promise<number> {
        return await this.petsService.countPets();
    }

    @PublicAccess()
    @Get('allPets')
    async getAll(): Promise<Pet[]> {
        return await this.petsService.allPets();
    }

    @PublicAccess()
    @Get('filter__:pageNumber')
    async getPets(@Param('pageNumber', ParseIntPipe) pageNumber: number, @Query('specie') specie?: string, @Query('location') location_id?: number, @Query('sex') sex?: string,): Promise<PetDTO[]> {
        return await this.petsService.filterPets(pageNumber, specie, location_id, sex);
    }

    @AdminAccess()
    @Post('addPet')
    async getAddPet(@Body() petDTO: CreatePetDTO): Promise<string> {
        return await this.petsService.addPet(petDTO);
    }

    @PublicAccess()
    @Get('oldPets')
    async getOlderPets(): Promise<PetDTO[]> {
        return this.petsService.olderPets();
    }

    @Roles('USER')
    @Patch('addInterested/:petId')
    async getAddInterested(@Param('petId', ParseIntPipe) petId: number): Promise<string> {
        return await this.petsService.addInterested(petId);
    }

    @AdminAccess()
    @Patch('update/:petId')
    async getUpdatePet(@Param('petId', ParseIntPipe) petId: number, @Body() body: UpdatePetDTO): Promise<string> {
        return await this.petsService.updatePet(petId, body);
    }

    @AdminAccess()
    @Delete('delete/:petId')
    async getDeletePet(@Param('petId', ParseIntPipe) petId: number): Promise<string> {
        return this.petsService.deletePet(petId);
    }
}
