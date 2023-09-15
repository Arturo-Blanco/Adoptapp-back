import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, HttpStatus, Res, Patch } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDTO, PetDTO } from './dto/pet.dto';

@Controller('pets')
export class PetsController {
    constructor(private readonly petsService: PetsService) { }

    @Get('count')
    async getCount(): Promise<any> {
        console.log(await this.petsService.countPets())
    }
    @Get('allPets')
    async getAll(): Promise<PetDTO[]> {
        return await this.petsService.allPets();
    }
    /*
    @Get('filter__:pageNumber')
    async getPets(@Param('pageNumber', ParseIntPipe) pageNumber: number, @Query('specie') specie?: string, @Query('sex') sex?: string, @Query('location') location?: string): Promise<any> {
        return await this.petsService.getPets(pageNumber, specie, sex, location);
    }
    @Get('/newPets')
    getNewPets(): Promise<any> {
        return this.petsService.newPets();
    }
    @Patch('addInterested/:param')
    async getAddInterested(@Param('param', ParseIntPipe) param: number, @Res() res: any): Promise<any> {
        return await this.petsService.addInterested(param);
    }*/
    @Post('addPet')
    async getAddPet(@Body() petDTO: CreatePetDTO): Promise<string> {
        return await this.petsService.addPet(petDTO);
    }
    /*
    @Post('adoptedPet/:petId/:userId')
    async getAdoptedPet(@Param('petId', ParseIntPipe) petId: number, @Param('userId', ParseIntPipe) userId: number): Promise<any> {
            return await this.petsService.wasAdopted(petId, userId)
    }*/
}
