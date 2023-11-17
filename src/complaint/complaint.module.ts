import { Module } from '@nestjs/common';
import { ComplaintService } from './services/complaint.service';
import { ComplaintController } from './controllers/complaint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { City } from 'src/city/entities/city.entity';
import { Complainant } from './entities/complainant.entity';
import { ComplaintType } from './entities/complaint.types.entity';
import { ComplaintTypeController } from './controllers/complaintType.controller';
import { ComplaintTypeService } from './services/complaintType.service';
import { ComplainantService } from './services/complainant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, ComplaintType, City, Complainant])
  ],
  controllers: [ComplaintController, ComplaintTypeController],
  providers: [ComplaintService, ComplaintTypeService, ComplainantService],
})
export class ComplaintModule {}
