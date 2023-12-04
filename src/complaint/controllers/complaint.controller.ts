import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ComplaintService } from '../services/complaint.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ComplaintDTO, CreateComplaintDTO } from '../dto/complaint.dto';
import { Complaint } from '../entities/complaint.entity';

@Controller('complaint')
export class ComplaintController {
  constructor(
    private readonly complaintService: ComplaintService,
  ) { }

  @Post('addComplaint')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() complaintDTO: CreateComplaintDTO): Promise<void> {
      return await this.complaintService.createComplaint(file, complaintDTO);
  }

  @Get('all')
  async getAll() : Promise <ComplaintDTO[]>{
    return await this.complaintService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComplaintDto) {
    return this.complaintService.update(+id, updateComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintService.remove(+id);
  }
}
