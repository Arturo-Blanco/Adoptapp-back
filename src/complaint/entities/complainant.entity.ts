import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Complaint } from "./complaint.entity";

@Entity({ name: 'complainants' })
export class Complainant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false, length: 15 })
    phone_number: string;

    @OneToMany(() => Complaint, complaint => complaint.complainants)
    complaints: Complaint[];

    constructor(email: string, phoneNumber: string) {
        this.email = email;
        this.phone_number = phoneNumber;
    }
    public getId(): number {
        return this.id;
    }
    public getEmail(): string {
        return this.email;
    }
    public getPhoneNumber(): string {
        return this.phone_number;
    }
    public setEmail(newEmail: string): void {
        this.email = newEmail;
    }
    public setPhoneNumber(newPhoneNumber: string): void {
        this.phone_number = newPhoneNumber;
    }
}