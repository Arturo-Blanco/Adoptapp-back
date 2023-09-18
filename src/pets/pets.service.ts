import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreatePetDTO, PetDTO, UpdatePetDTO } from './dto/pet.dto';
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

  // Function to add a new pet
  async addPet(petDTO: CreatePetDTO): Promise<string> {
    try {
      // Check if required values are missing
      if (!this.checkValues(petDTO)) {
        throw new Error('Required fields missing: name, age, sex, species, description, attributes, image url.');
      };
      // Check if empty values are not accepted
      if (!this.checkEmptyValues(petDTO)) {
        throw new Error('Empty fields are not accepted.');
      }
      // Check if valid keys are used
      if (!this.checkValidKeys(petDTO)) {
        throw new Error(`Invalid key for the pet. Please enter name, sex, age, description, image url, zip code or species.`)
      }
      // Verify the city with its zip code
      const criterion: FindOneOptions = { where: { zipCode: Number(petDTO.zipCode) } };
      const city = await this.cityRepository.findOne(criterion);
      // If the city doesn't exist, throw an error
      if (!city) {
        throw new Error(`There is no city with zip code ${petDTO.zipCode}.`);
      }
      // Map and create attributes for the pet
      const petAttributes = await this.handleAttributes(petDTO.attributes);
      // Create a new pet with the provided arguments
      const newPet: Pet = new Pet(petDTO.name, petDTO.specie, petDTO.sex, petDTO.age, city, petAttributes, petDTO.description, petDTO.urlImg);

      if (!newPet) {
        throw new Error(`Error adding pet ${petDTO.name}.`);
      }

      await this.petRepository.save(newPet);
      return `Added pet ${petDTO.name}.`

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Error adding pet ${petDTO.name} - ` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  };

  // Function to filter pets based on criteria
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

      if (!data) {
        throw new Error('Pet capture error.');
      }

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

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Pet capture error -` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  // Function to retrieve older pets
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

      if (!olderPets) {
        throw new Error('Pet capture error.')
      }

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

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Pet capture error -` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  // Function to count the number of pets
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

  // Function to retrieve all pets
  async allPets(): Promise<Pet[]> {
    try {
      // Get pets with their relationship and values
      const criterion: FindManyOptions = { relations: ['attributes', 'city'] };
      const data = await this.petRepository.find(criterion);

      if (!data) {
        throw new Error('Error getting data.');
      }

      return data;

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting data - ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  // Function to add an interested party to a pet
  async addInterested(petId: number): Promise<string> {
    try {
      const criterion: FindOneOptions = { where: { id: petId } };
      const pet: Pet = (await this.petRepository.findOne(criterion));

      if (!pet) {
        throw new Error(`The pet with ID ${petId} does not exist.`);
      }

      pet.setInterested();
      await this.petRepository.save(pet);
      return `${pet.getName()} has new interested.`

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Error adding interested - ' + error.message,
      }, HttpStatus.CONFLICT);
    }
  }

  // Function to mark a pet as available
  async setAvailable(petId: number): Promise<string> {
    try {
      const criterion: FindOneOptions = { where: { id: petId } };
      const pet: Pet = await this.petRepository.findOne(criterion);

      if (!pet) {
        throw new Error(`The pet with ID ${petId} does not exist.`);
      }

      pet.setAvailable();
      await this.petRepository.save(pet);
      return `${pet.getName()} was adopted.`

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Pet capture error - ' + error.message,
      }, HttpStatus.CONFLICT);
    }
  }

  // Function to update a pet's information
  async updatePet(petId: number, body: UpdatePetDTO): Promise<string> {
    try {
      const criterion: FindOneOptions = { where: { id: petId } };
      const pet: Pet = await this.petRepository.findOne(criterion);
      if (!pet) {
        throw new Error(`The pet with ID ${petId} does not exist.`);
      }

      if (body.attributes && body.attributes.length > 0) {
        pet.setAttributes(await this.handleAttributes(body.attributes));
      }

      if (body.zipCode) {
        const criterion: FindOneOptions = { where: { zipCode: Number(body.zipCode) } };
        const city = await this.cityRepository.findOne(criterion);
        pet.setCity(city);
      }

      if (!this.checkEmptyValues(body)) {
        throw new Error('Empty fields are not accepted.');
      }

      if (!this.checkValidKeys(body)) {
        throw new Error(`Invalid key for the pet. Please enter name, sex, age, description, image url, zip code or species.`)
      }

      pet.setName(body.name);
      pet.setAge(body.age);
      pet.setSex(body.sex);
      pet.setSpecie(body.specie);
      pet.setDescription(body.description);
      pet.setUrlImg(body.urlImg);
      return `The pet ${pet.name} was updated.`

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Pet capture error - ' + error.message,
      }, HttpStatus.CONFLICT);
    }
  }

  // Check that the properties to create a pet exist
  checkValues(body) {
    if (!body.name ||
      !body.age ||
      !body.sex ||
      !body.description ||
      !body.urlImg ||
      !body.specie ||
      (!body.attributes &&
        body.attributes.length === 0)) {
      return false;
    }
    return true;
  }

  // Check that the properties' values are not empty
  checkEmptyValues(body) {
    if (body.name === "" ||
      body.age === null ||
      body.description === "" ||
      body.urlImg === "" ||
      body.sex === "" ||
      body.specie === "") {
      return false;
    }
    return true;
  }

  // Check that the properties are those required
  checkValidKeys(body: Object) {
    const validKeys = ['name', 'age', 'zipCode', 'sex', 'description', 'urlImg', 'specie', 'attributes'];
    const keys = Object.keys(body);

    for (const key of keys) {
      if (validKeys.includes(key)) {
        return true;
      }
    }
    return false;
  }

  // Function to take, create, and assign attributes to the pet
  async handleAttributes(attributes: string[]): Promise<Attribute[]> {
    try {
      const attributesCriteria: FindManyOptions = { where: attributes.map(attributeName => ({ name: attributeName })) }
      const existingAttributes = await this.attributRepository.find(attributesCriteria);

      const attributeToCreate = attributes.filter(attribute => !existingAttributes.some(existingAttributes => existingAttributes.name.toLowerCase() === attribute.toLowerCase()));

      const newAttributes = await Promise.all(
        attributeToCreate.map(async attribute => {
          const newAttribute = new Attribute(attribute);
          return await this.attributRepository.save(newAttribute);
        })
      );
      const petAttributes = [...existingAttributes, ...newAttributes];
      return petAttributes;
    } catch (error) {
      throw new error(`Error getting attributes - ` + error.message);
    }
  }
}