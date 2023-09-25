import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Complaint } from "./complaint.entity";

@Entity({ name: 'complainants'})
export class Complainant {
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column({nullable : false})
    email: string;

    @Column({nullable : false , length: 15})
    phone_number : string;

    @OneToMany(() => Complaint, complaint => complaint.complainants)
    complaints : Complaint[]; 

    constructor(email: string, phoneNumber : string) {
        this.email = email;
        this.phone_number = phoneNumber;
    }
}