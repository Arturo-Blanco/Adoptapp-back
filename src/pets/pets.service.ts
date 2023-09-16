import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreatePetDTO, PetDTO } from './dto/pet.dto';
import { City } from 'src/city/entities/city.entity';
import { Attribute } from './attributes/entities/attribute.entity';

@Injectable()
export class PetsService {

  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Attribute)
    private readonly attributRepository: Repository<Attribute>
  ) { }

  async addPet(petDTO: CreatePetDTO): Promise<string> {
    try {
      // First the city is verified with its zip code
      const criterion: FindOneOptions = { where: { zipCode: Number(petDTO.zipCode) } };
      const city = await this.cityRepository.findOne(criterion);
      // If the city doesn't exits a new errro is generated
      if (!city) {
        throw new Error(`There isn't city with a code ${petDTO.zipCode}.`);
      }
      // Pets attributes are mapped. If the attribute doesn't exist, it's created and assigned to that pet
      const attributesCriteria: FindManyOptions = { where: petDTO.attributes.map(attributeName => ({ name: attributeName })) }
      const existingAttributes = await this.attributRepository.find(attributesCriteria);

      const attributeToCreate = petDTO.attributes.filter(attribute => !existingAttributes.some(existingAttributes => existingAttributes.name.toLowerCase() === attribute.toLowerCase()));

      const newAttributes = await Promise.all(
        attributeToCreate.map(async attribute => {
          const newAttribute = new Attribute(attribute);
          return await this.attributRepository.save(newAttribute);
        })
      );
      const petAttributes = [...existingAttributes, ...newAttributes];
      // A new pet is created with its arguments
      const newPet: Pet = new Pet(petDTO.name, petDTO.specie, petDTO.sex, petDTO.age, city, petAttributes, petDTO.description, petDTO.urlImg);
      if (newPet) {
        await this.petRepository.save(newPet);
        return `Added pet ${petDTO.name}.`
      } else {
        throw new Error(`Error adding pet ${petDTO.name}.`);
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Error adding pet ${petDTO.name} - ` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  };

  async filterPets(pageNumber: number, specie?: string, location_id?: number, sex?: string): Promise<PetDTO[]> {
    try {
      const elementsPage = 10;
      const skipItems = (pageNumber - 1) * elementsPage;

      const filter = {
        ...(specie ? { specie } : {}),
        ...(location_id ? { fk_city_id: Number(location_id) } : {}),
        ...(sex ? { sex } : {})
      }

      const criterion: FindManyOptions = {
        relations: ['attributes', 'city'],
        take: elementsPage,
        where: filter,
        skip: skipItems
      };
      const data = await this.petRepository.find(criterion);
      if (data) {
        const petData: PetDTO[] = data.map(pet => ({
          id: pet.id,
          name: pet.name,
          sex: pet.sex,
          age: pet.age,
          city: pet.city.name,
          attributes: pet.attributes.map(attribute => (attribute.name)),
          description: pet.description,
          urlImg: pet.urlImg,
          interested: pet.interested,
        }));
        return petData;
      } else {
        throw new Error('Pet capture error.');
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Pet capture error -` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async olderPets(): Promise<PetDTO[]> {
    try {
      const criterion: FindManyOptions = {
        relations: ['attributes', 'city'],
        order: {
          creationDate: 'DESC',
        },
        take: 8,
      }
      const olderPets = await this.petRepository.find(criterion);
      if (olderPets) {
        const petData: PetDTO[] = olderPets.map(pet => ({
          id: pet.id,
          name: pet.name,
          sex: pet.sex,
          age: pet.age,
          city: pet.city.name,
          attributes: pet.attributes.map(attribute => (attribute.name)),
          description: pet.description,
          urlImg: pet.urlImg,
          interested: pet.interested,
        }));
        return petData;
      } else {
        throw new Error('Pet capture error.')
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Pet capture error -` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async countPets(): Promise<number> {
    try {
      return await this.petRepository.count();
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Error when counting pets -` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  };

  async allPets(): Promise<Pet[]> {
    try {
      // Get pets with their relationship and values
      const criterion: FindManyOptions = { relations: ['attributes', 'city'] };
      const data = await this.petRepository.find(criterion);
      if (data) {
        return data;
      } else {
        throw new Error('Error getting data.');
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting data - ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async addInterested(petId: number): Promise<string> {
    try {
      const criterion: FindOneOptions = { where: { id: petId } };
      const pet: Pet = (await this.petRepository.findOne(criterion));
      if (pet) {
        pet.setInterested();
        await this.petRepository.save(pet);
        return `${pet.getName()} has new ineterested.`
      }
      else {
        throw new Error(`The pet with ID ${petId} doesn't exist.`);
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Error adding interested - ' + error.message,
      }, HttpStatus.CONFLICT);
    }
  }

  async setAvailable(petId: number): Promise<string> {
    try {
      const criterion: FindOneOptions = { where: { id: petId } };
      const pet: Pet = (await this.petRepository.findOne(criterion));
      if (pet) {
        pet.setAvailable();
        await this.petRepository.save(pet);
        return `${pet.getName()} was adopted.`
      }
      else {
        throw new Error(`The pet with ID ${petId} doesn't exist.`);
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Pet capture error - ' + error.message,
      }, HttpStatus.CONFLICT);
    }
  }
}