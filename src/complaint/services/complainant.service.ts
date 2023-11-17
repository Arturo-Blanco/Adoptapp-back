import { InjectRepository } from '@nestjs/typeorm';
import { Complainant } from './../entities/complainant.entity';
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, Repository } from 'typeorm';
import { ComplainantDTO } from '../dto/complaint.dto';

@Injectable()
export class ComplainantService {
    constructor(
        @InjectRepository(Complainant)
        private readonly complainantRepository: Repository<Complainant>
    ) { }

    async createComplainant(createComplainantDTO: ComplainantDTO): Promise<Complainant> {
        const { email, phoneNumber } = createComplainantDTO;
        try {
            const newComplainant: Complainant = new Complainant(email, phoneNumber);
            if (!newComplainant) {
                throw new Error('Error adding new complainant.');
            }
            return await this.complainantRepository.save(newComplainant);
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async findComplainant(complainantEmail: number): Promise<Complainant> {
        try {
            const criterion: FindOneOptions = { where: { email: complainantEmail } };
            const complainant: Complainant = await this.complainantRepository.findOne(criterion);
            if (!complainant) {
                throw new NotFoundException(`There is no complainant with email ${complainantEmail}.`);
            }
            return complainant;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }
}