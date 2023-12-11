import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CityService } from "src/city/city.service";
import { PetsService } from "src/pets/pets.service";
import { UserService } from "src/users/user.service";
import { Adoption } from "./entities/adoptions.entity";
import { DataSource, Repository } from "typeorm";
import { AdoptionDTO } from "./dto/adoption.dto";
import { City } from "src/city/entities/city.entity";
import { User } from "src/users/entities/user.entity";
import { Pet } from "src/pets/entities/pet.entity";

@Injectable()
export class AdoptionService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
        private readonly cityService: CityService,
        private readonly petService: PetsService,
        @InjectRepository(Adoption)
        private readonly adoptionRepository: Repository<Adoption>,
        @InjectRepository(Pet)
        private readonly petRepository: Repository<Pet>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }



    async findAdoptions(): Promise<Adoption[]> {
        try {
            const adoptions: Adoption[] = await this.adoptionRepository.find();
            if (!adoptions) {
                throw new NotFoundException('There is not adoptions yet.')
            }
            return adoptions;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Error when entering the new adoption - ' + error.message,
            }, HttpStatus.CONFLICT);
        }
    }
    // Function to mark a pet as available
    async wasAdopted({ petId, userId, zipCode }: AdoptionDTO): Promise<string> {
        try {
            const pet: Pet = await this.petService.findById(petId);
            const user: User = await this.userService.findById(userId);
            const city: City = await this.cityService.findByZip(zipCode);

            const newAdoption: Adoption = new Adoption();
            newAdoption.pet = pet;
            newAdoption.user = user;
            newAdoption.city = city;

            const userPets = user.pets
            const requestedPet = userPets.map(pet => pet.id);
            const indexPet = requestedPet.indexOf(petId);
            requestedPet.splice(indexPet, 1);

            user.setInterestedIn(userPets);
            // If the user does not have a requested pet, an empty array is assigned
            if (requestedPet.length === 0) {
                user.pets = [];
            }
            pet.setAvailable(false);

            await this.dataSource.transaction(async (manager) => {
                await manager.save(User, user);
                await manager.save(Adoption, newAdoption);
                await manager.save(Pet, pet);
            });

            return `${pet.getName()} was adopted in ${city.getName()} by ${user.getSurname()} ${user.getName()}.`

        } catch (error) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Error when entering the new adoption - ' + error.message,
            }, HttpStatus.CONFLICT);
        }
    }

}