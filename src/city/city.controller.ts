import { City } from './entities/city.entity';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDTO, UpdateCityDTO } from './dto/city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) { }

  @Post('addCity')
  async getAddCity(@Body() createCityDTO: CreateCityDTO): Promise<string> {
    return await this.cityService.addCity(createCityDTO);
  }

  @Get('all')
  async getCities(): Promise<City[]> {
    return await this.cityService.allCities();
  }

  @Get('zipCode/:zipCode')
  async getByZip(@Param('zipCode', ParseIntPipe) zipCode: number): Promise<City> {
    return await this.cityService.findByZip(zipCode);
  }

  @Get('id/:cityId')
  async getById(@Param('cityId', ParseIntPipe) cityId: number): Promise<City> {
    return await this.cityService.findById(cityId)
  }

  @Patch('update/:cityId')
  async getUpdateCity(@Param('cityId', ParseIntPipe) cityId: number, @Body() data: UpdateCityDTO): Promise<string> {
    return await this.cityService.updateCity(cityId, data);
  }

  @Delete('delete/:cityId')
  async getDeleteCity(@Param('cityId', ParseIntPipe) cityId : number) : Promise <string | void > {
    return await this.cityService.deleteCity(cityId);
  }
}