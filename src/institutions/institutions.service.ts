import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Institution } from "./entities/institution.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CreateInstitutionDTO, UpdateInstitutionDTO } from "./dto/institution.dto";
import { CityService } from "src/city/city.service";
import { City } from "src/city/entities/city.entity";

@Injectable()
export class InstitutionService {

    constructor(
        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>,
        private readonly cityService: CityService
    ) { }

    async addInstitution(createInstitutionDTO: CreateInstitutionDTO): Promise<Institution> {
        const { name, city_id } = createInstitutionDTO;
        try {
            const city: City = await this.cityService.findById(city_id);
            const newInstitution: Institution = new Institution(name);
            if (!newInstitution) {
                throw new Error('Error creating institution.');
            }
            newInstitution.fk_city_id = city.getId();
            return await this.institutionRepository.save(newInstitution);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error adding institution - ` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }

    async allInstitution(): Promise<Institution[]> {
        try {
            const criteria: FindManyOptions = { relations: ['city'] }
            const allInstitution: Institution[] = await this.institutionRepository.find(criteria);
            if (!allInstitution) {
                throw new NotFoundException('There are no institution.');
            }
            return allInstitution;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error adding institution - ` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }

    async getById(institutionId: number): Promise<Institution> {
        try {
            const criteria: FindOneOptions = { where: { id: institutionId }, relations: ['city'] };
            const institution: Institution = await this.institutionRepository.findOne(criteria);
            if (!institution) {
                throw new NotFoundException(`There is no institution woth id ${institutionId}.`);
            }
            return institution;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error getting institute - ` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }

    async updateInstitution(institutionId: number, updateInstitutionDTO: UpdateInstitutionDTO): Promise<string> {
        const { name, city_id } = updateInstitutionDTO;
        try {
            const city: City = await this.cityService.findById(city_id);
            const institution: Institution = await this.getById(institutionId);
            institution.setName(name);
            if (city) {
                institution.city = city;
            }
            await this.institutionRepository.save(institution);
            return `Institution with id ${institutionId} was updated.`
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error updating institute - ` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }

    async deleteInstitution(institutionId: number): Promise<string> {
        try {
            const institution: Institution = await this.getById(institutionId);
            await this.institutionRepository.remove(institution);
            return `Institution with id ${institutionId} was removed.`
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error removing institute - ` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }
}