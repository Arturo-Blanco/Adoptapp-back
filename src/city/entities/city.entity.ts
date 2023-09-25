import { Adoption } from "src/Services/adoptions/entities/adoptions.entity";
import { Complaint } from "src/Services/complaint/entities/complaint.entity";
import { Information } from "src/Services/information/entities/information.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";

@Entity({ name: 'cities' })
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    zip_code: number

    @OneToMany(() => Pet, pet => pet.city)
    pets: Pet[];

    @OneToMany(() => User, user => user.city)
    users: User[];

    @OneToMany(() => Adoption, adoption => adoption.city)
    adoption : Adoption[];

    @OneToMany(() => Complaint, complaint => complaint.city)
    complaints : Complaint[];
    
    @OneToMany(() => Information, information => information.city)
    informations : Information[];
    
    constructor(name: string, zipCode: number) {
        this.name = name;
        this.zip_code = zipCode;
    }

    public getName(): string {
        return this.name;
    }
    public getZipCode(): number {
        return this.zip_code;
    }
    public setName(newName: string): void {
        this.name = newName;
    }
    public setZipCode(newZipCode: number): void {
        this.zip_code = newZipCode;
    }
}
