import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
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

      const city = await this.cityRepository.findOne({ where: { zipCode: petDTO.zipCode } });
      if (!city) {
        throw new Error(`Error when selecting city ${city.name}.`);
      }
      const attributeName = petDTO.attributes.map(attribute => attribute);
      console.log(attributeName)
      const attributes = await this.attributRepository
        .createQueryBuilder('attribute')
        .where('attribute.name IN (:...attributeName)', { attributeName })
        .getMany();
      console.log(attributes)
      const newPet: Pet = new Pet(petDTO.name, petDTO.specie, petDTO.sex, petDTO.age, city, attributes, petDTO.description, petDTO.urlImg);
/*
      if (newPet) {
        await this.petRepository.save(newPet);
        return `Added pet ${petDTO.name}.`
      } else {
        throw new Error(`Error when adding pet ${petDTO.name}.`);
      }*/
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: `Error al agregar la mascota ${petDTO.name} - ` + error,
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
        error: `Error when counting pets -` + error,
      },
        HttpStatus.BAD_REQUEST)
    }
  }
  async allPets() : Promise <PetDTO[]> {
    try {
        const data = await this.petRepository.find({relations: ['attributes', 'city']});
        if(data) {
          const pet = data.map(pet => ({
              id : pet.id,  
              name : pet.name,
              sex : pet.sex,
              age: pet.age,
              city: pet.city.name,
              attributes : pet.attributes.map(attribut => (attribut.name)),
              description: pet.description,
              urlImg: pet.urlImg,
              interested : pet.interested,
          }))
          return pet
        }
    }catch(error) {
      console.error(error)
    }
  } 

}
