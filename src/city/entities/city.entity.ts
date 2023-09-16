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
    zipCode: number

    @OneToMany(() => Pet, pet => pet.city)
    pets: Pet[];

    @OneToMany(() => User, user => user.city)
    users: User[];

    constructor(name: string, zipCode: number) {
        this.name = name;
        this.zipCode = zipCode;
    }

    public getCityName() : string {
        return this.name;
    }
    public getZipCode() : number {
        return this.zipCode;
    }

}
