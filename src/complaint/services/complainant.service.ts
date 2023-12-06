import { ComplainantDTO } from './../dto/complaint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Complainant } from './../entities/complainant.entity';
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ComplainantService {
    constructor(
        @InjectRepository(Complainant)
        private readonly complainantRepository: Repository<Complainant>
    ) { }

    async createComplainant(createComplainantDTO: ComplainantDTO): Promise<Complainant> {
        const { phoneNumber } = createComplainantDTO;
        try {
            const newComplainant: Complainant = new Complainant(phoneNumber);
            return await this.complainantRepository.save(newComplainant);
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error creating complainant' + error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(): Promise<Complainant[]> {
        try {
            const complainants: Complainant[] = await this.complainantRepository.find();
            if (!complainants) {
                throw new Error('Error getting complainants.');
            }
            return complainants;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async updateComplainant(complainantId: number, complainantDTO: ComplainantDTO): Promise<string> {
        const { phoneNumber } = complainantDTO;
        try {
            const complainant: Complainant = await this.findById(complainantId);
            if (!complainant) {
                throw new NotFoundException(`There is no complainant with id ${complainantId}.`);
            }
            if (phoneNumber) {
                complainant.setPhoneNumber(phoneNumber)
            }
            await this.complainantRepository.save(complainant);

            return `Complainant with id ${complainantId} was edited.`
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteComplainant(complainantId: number): Promise<string> {
        try {
            const complainant: Complainant = await this.findById(complainantId);
            if (!complainant) {
                throw new NotFoundException(`There is no complainant with id ${complainantId}.`);
            }
            await this.complainantRepository.remove(complainant);

            return `Complainant with id ${complainantId} was deleted.`
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async findByPhone(complainantPhone: string): Promise<Complainant> {
        try {
            const criterion: FindOneOptions = { where: { phone_number: complainantPhone} };
            const complainant: Complainant = await this.complainantRepository.findOne(criterion);
            return complainant;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async findById(complainantId: number): Promise<Complainant> {
        try {
            const criterion: FindOneOptions = { where: { id: complainantId } };
            const complainant: Complainant = await this.complainantRepository.findOne(criterion);
            if (!complainant) {
                throw new NotFoundException(`There is no complainant with email ${complainant}.`);
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