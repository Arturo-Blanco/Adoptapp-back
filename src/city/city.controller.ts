import { City } from './entities/city.entity';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDTO } from './dto/city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) { }

  @Post('addCity')
  async getAddCity(@Body() city: CreateCityDTO): Promise<string> {
    return await this.cityService.addCity(city);
  }
  @Get('all')
  async getCities(): Promise<City[]> {
    return await this.cityService.allCities();
  }
}