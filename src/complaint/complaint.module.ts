import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { City } from 'src/city/entities/city.entity';
import { Complainant } from './entities/complainant.entity';
import { ComplaintType } from './entities/complaint.types.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, ComplaintType, City, Complainant])
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
