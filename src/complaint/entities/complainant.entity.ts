import { Column, Entity,OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Complaint } from "./complaint.entity";

@Entity({ name: 'complainants' })
export class Complainant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, length: 15 })
    phone_number: string;

    @OneToMany(() => Complaint, complaint => complaint.complainant)
    complaints: Complaint[];

    constructor(phoneNumber: string) {
        this.phone_number = phoneNumber;
    }
    public getId(): number {
        return this.id;
    }
    public getPhoneNumber(): string {
        return this.phone_number;
    }
    public setPhoneNumber(newPhoneNumber: string): void {
        this.phone_number = newPhoneNumber;
    }
}