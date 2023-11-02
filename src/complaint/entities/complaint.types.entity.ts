import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Complaint } from './complaint.entity';

@Entity({ name: 'complaint_types' })
export class ComplaintType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @OneToMany(() => Complaint, complaint => complaint.complaintType)
    complaints: Complaint[];

    constructor(type: string) {
        this.type = type;
    }

    public getId(): number {
        return this.id;
    }
    public getType(): string {
        return this.type;
    }
    public setType(newType: string): void {
        this.type = newType;
    }
}