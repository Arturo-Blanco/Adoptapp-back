import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { ComplaintTypeDTO } from "../dto/complaint.dto";
import { ComplaintType } from "../entities/complaint.types.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class ComplaintTypeService {

    constructor(
        @InjectRepository(ComplaintType)
        private readonly complaintTypeRepository: Repository<ComplaintType>
    ) { }

    async createType(createComplaintType: ComplaintTypeDTO): Promise<ComplaintType> {
        try {
            const newType: ComplaintType = new ComplaintType(createComplaintType.type);
            if (!newType) {
                throw new Error('Error adding new complaint type.');
            }
            return await this.complaintTypeRepository.save(newType);

        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async getAll(): Promise<ComplaintType[]> {
        try {
            const result: ComplaintType[] = await this.complaintTypeRepository.find();
            if (!result) {
                throw new NotFoundException(`Error getting data.`);
            }
            return result;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async updateType(complaintTypeId: number, complaintType: ComplaintTypeDTO): Promise<string> {
        try {
            const result : ComplaintType = await this.findById(complaintTypeId);
            result.setType( complaintType.type  )
            await this.complaintTypeRepository.save(result);
            
            return 'Complaint type was edited.';

        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error updating complaint type, ' + error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteType(complaintTypeId: number): Promise<string> {
        try {
            const result = await this.findById(complaintTypeId);
            await this.complaintTypeRepository.remove(result);

            return 'Complaint type was deleted.'
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error removing complaint type, ' + error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }


    async findComplaintType(complaintType: string): Promise<ComplaintType> {
        try {
            const criterion: FindOneOptions = { where: { type: complaintType } };
            const result: ComplaintType = await this.complaintTypeRepository.findOne(criterion);
            if (!result) {
                throw new NotFoundException(`There is no complaint type: ${complaintType}.`);
            }
            return result;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async findById(complaintTypeId: number): Promise<ComplaintType> {
        try {
            const criterion: FindOneOptions = { where: { id: complaintTypeId } };
            const result: ComplaintType = await this.complaintTypeRepository.findOne(criterion);
            if (!result) {
                throw new NotFoundException(`There is no complaint type with id: ${complaintTypeId}.`);
            }
            return result;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async findByName(complaintType: string): Promise<ComplaintType> {
        try {
            const criterion: FindOneOptions = { where: { type: complaintType } };
            const result: ComplaintType = await this.complaintTypeRepository.findOne(criterion);
            if (!result) {
                throw new NotFoundException(`There is no complaint type with name: ${complaintType}.`);
            }
            return result;
        }
        catch (error) {
            console.log('error findByName function');
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: error.message
            }, HttpStatus.BAD_REQUEST);
        }
    }
}