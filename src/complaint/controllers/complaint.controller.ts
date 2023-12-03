import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ComplaintService } from '../services/complaint.service';
import { ImageService } from 'src/Sharp/image.service';
import { FirebaseStorageService } from 'src/Firebase/firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuid4 } from 'uuid';
import { CreateComplaintDTO } from '../dto/complaint.dto';

@Controller('complaints')
export class ComplaintController {
  constructor(
    private readonly complaintService: ComplaintService,
    private readonly imageService: ImageService,
    private readonly firebaseService: FirebaseStorageService
  ) { }

  @Post('addComplaint')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: CreateComplaintDTO): Promise<void> {
    try {
      console.log(body);
      const newFileName = `${uuid4()}.jpeg`; // File name is change to a unique id
      const processImage = await this.imageService.processImage(file.buffer); // File is process
      const imgUrl = await this.firebaseService.uploadFile(newFileName, processImage); // File is uploaded to Firebase and return the URL
      await this.complaintService.createComplaint(imgUrl, body);
    } catch (error) {
      throw new Error('Error processing image.' + error.message);
        }
  }

  @Get('all')
  findAll() {
    return this.complaintService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(+id);
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
