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

  async addPet(petDTO: CreatePetDTO): Promise<any> {
    try {
      // First the city is verified with its zip code
      const criterion: FindOneOptions = { where: { zipCode: petDTO.zipCode } };
      const city = await this.cityRepository.findOne(criterion);
      // If the city doesn't exits a new errro is generated
      if (!city) {
        throw new Error(`There isn't city with a code ${petDTO.zipCode}.`);
      }
      // Pets attributes are mapped. If the attribute doesn't exist, it's created and assigned to that pet
      const attributeNames = petDTO.attributes.map(attribute => attribute.toLowerCase());
      const attributes = await Promise.all(
        attributeNames.map(async attributeName => {

          const criterion: FindOneOptions = { where: { name: attributeName } };
          let attribute = await this.attributRepository.findOne(criterion);
          if (!attribute) {
            attribute = new Attribute(attributeName);
            await this.attributRepository.save(attribute);
          }
          return attribute;
        })
      )
      // A new pet is created with its arguments
      const newPet: Pet = new Pet(petDTO.name, petDTO.specie, petDTO.sex, petDTO.age, city, attributes, petDTO.description, petDTO.urlImg);
      if (newPet) {
        await this.petRepository.save(newPet);
        return `Added pet ${petDTO.name}.`
      } else {
        throw new Error(`Error when adding pet ${petDTO.name}.`);
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Error al agregar la mascota ${petDTO.name} - ` + error.message,
      },
        HttpStatus.BAD_REQUEST);
    }
  };

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

  async allPets(): Promise<PetDTO[]> {
    try {
      // Get pets with their relationship and values
      const criterion : FindManyOptions = { relations: ['attributes', 'city']};
      const data = await this.petRepository.find(criterion);
      if (data) {
        const petData: PetDTO[] = data.map(pet => ({
          id: pet.id,
          name: pet.name,
          sex: pet.sex,
          age: pet.age,
          city: pet.city.name,
          attributes: pet.attributes.map(attribut => (attribut.name)),
          description: pet.description,
          urlImg: pet.urlImg,
          interested: pet.interested,
        }));
        return petData;
      } else {
        throw new Error('Error getting data.');
      }
    } catch (error) {
      new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error gettin data - ' + error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
