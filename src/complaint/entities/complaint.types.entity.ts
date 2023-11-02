import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Complaint } from './complaint.entity';

@Entity({ name : 'complaint_types'})
export class ComplaintType {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    type: string;

    @OneToMany(() => Complaint, complaint => complaint.complaintType) 
    complaints : Complaint[]
}