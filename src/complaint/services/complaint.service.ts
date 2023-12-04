import { Complainant } from '../entities/complainant.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComplaintType } from '../entities/complaint.types.entity';
import { Complaint } from '../entities/complaint.entity';
import { ComplainantDTO, ComplaintDTO, CreateComplaintDTO } from '../dto/complaint.dto';
import { ComplaintTypeService } from './complaintType.service';
import { ComplainantService } from './complainant.service';
import { City } from 'src/city/entities/city.entity';
import { CityService } from 'src/city/city.service';
import { ImageService } from 'src/Sharp/image.service';
import { FirebaseStorageService } from 'src/Firebase/firebase.service';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    private readonly complaintTypeService: ComplaintTypeService,
    private readonly complainantService: ComplainantService,
    private readonly cityService: CityService,
    private readonly imageService: ImageService,
    private readonly firebaseService: FirebaseStorageService,
    private readonly dataSource: DataSource,
  ) { }

  async createComplaint(file: Express.Multer.File, createComplaintDTO: CreateComplaintDTO): Promise<any> {
    const { complaintDescription, petName, petSpecie, petAge, typeOfComplaint, zipCode, email, phoneNumber, showComplaint } = createComplaintDTO;

    try {
      const complainantDTO: ComplainantDTO = {
        email,
        phoneNumber,
      }

      let complainant: Complainant = await this.complainantService.findByEmail(email);

      if (!complainant) {
        complainant = await this.complainantService.createComplainant(complainantDTO)
      }

      const city: City = await this.cityService.findByZip(zipCode);
      const type: ComplaintType = await this.complaintTypeService.findComplaintType(typeOfComplaint);
      const newComplaint: Complaint = new Complaint(complaintDescription, petSpecie, petName, petAge, showComplaint ? true : false);
      if (!newComplaint) {
        throw new Error('Error adding new complaint.');
      }

      // File name is change to a unique id
      const newFileName = `${uuid4()}.jpeg`;
      // File is process
      const processImage = await this.imageService.processImage(file.buffer);
      const transaction = await this.dataSource.transaction(async manager => {
        // File is uploaded to Firebase and return the URL
        const imgUrl = await this.firebaseService.uploadFile(newFileName, processImage);
        newComplaint.complainant = complainant;
        newComplaint.city = city;
        newComplaint.complaintType = type;
        newComplaint.img_url = imgUrl;
        await manager.save(Complaint, newComplaint);
        return 'Transaction complete.'
      })
      return transaction
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<ComplaintDTO[]> {
    try {
      const complaints: Complaint[] = await this.complaintRepository.find({ where: { show_complaint: true }, relations: ['complaintType', 'complainant', 'city'] });
      if (!complaints) {
        throw new Error('Error getting complaints.');
      }
      const leakedComplaint: ComplaintDTO[] = complaints.map(complaint => ({
        description: complaint.description,
        type: complaint.complaintType.type,
        city: complaint.city.name,
        img_url: complaint.img_url,
        phoneNumber: complaint.complainant.phone_number,
        petName: complaint.pet_name,
        petAge: complaint.pet_age,
        petSpecie: complaint.pet_specie,
      }))

      return leakedComplaint;
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
