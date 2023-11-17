import { Complainant } from '../entities/complainant.entity';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplaintType } from '../entities/complaint.types.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Complaint } from '../entities/complaint.entity';
import { ComplainantDTO, ComplaintTypeDTO, CreateComplaintDTO } from '../dto/complaint.dto';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(ComplaintType)
    private readonly complaintTypeRepository: Repository<ComplaintType>,
    @InjectRepository(Complainant)
    private readonly complainantRepository: Repository<Complainant>,
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) { }

  async createComplaint(createComplaintDTO: CreateComplaintDTO): Promise<any> {
    const { type, complaintDate, description, imgUrl, complaintType, complaintCity, complainantEmail, complainantPhoneNumber } = createComplaintDTO;
    try {
      return "Hola"
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} complaint`;
  }

  update(id: number, updateComplaintDto) {
    return `This action updates a #${id} complaint`;
  }

  remove(id: number) {
    return `This action removes a #${id} complaint`;
  }
}
