import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { CreateCityDTO } from './dto/city.dto';


@Injectable()
export class CityService {

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>
  ) { }

  async addCity(city: CreateCityDTO): Promise<string> {
    try {
      const newCity: City = await this.cityRepository.save(new City(city.name, city.zipCode))
      if (newCity) {
        return `Added the city: ${city.name}.`
      }
      else {
        throw new Error(`Error when adding the city: ${city.name}.`)
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: `Error when adding new city -` + error,
      },
        HttpStatus.CONFLICT);
    };
  }
  async allCities(): Promise<City[]> {
    return await this.cityRepository.find()
  }
}
