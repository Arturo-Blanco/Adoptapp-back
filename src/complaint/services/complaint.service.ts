import { Complainant } from '../entities/complainant.entity';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplaintType } from '../entities/complaint.types.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Complaint } from '../entities/complaint.entity';
import { ComplainantDTO, ComplaintTypeDTO, CreateComplaintDTO } from '../dto/complaint.dto';
import { ComplaintTypeService } from './complaintType.service';
import { ComplainantService } from './complainant.service';
import { City } from 'src/city/entities/city.entity';
import { CityService } from 'src/city/city.service';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    private readonly complaintTypeService: ComplaintTypeService,
    private readonly complainantService: ComplainantService,
    private readonly cityService : CityService
  ) { }

  async createComplaint(filePath : string, createComplaintDTO: CreateComplaintDTO): Promise<any> {
    const { description, petName, petSpecie, petAge, complaintType, zipCode, email, phoneNumber } = createComplaintDTO;
    try {
        const complainantDTO : ComplainantDTO = {
          email,
          phoneNumber
        }
        const complainant : Complainant = await this.complainantService.createComplainant(complainantDTO);
        const city : City = await this.cityService.findById(zipCode);
        const type : ComplaintType = await this.complaintTypeService.findById(complaintType);

        const newComplaint : Complaint = new Complaint(description,filePath,petSpecie,petName,petAge);
        if(!newComplaint){
          throw new Error('Error adding new complaint.');
        }
        newComplaint.complainant = complainant;
        newComplaint.city = city;
        newComplaint.complaintType = type;

        return await this.complaintRepository.save(newComplaint);
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
