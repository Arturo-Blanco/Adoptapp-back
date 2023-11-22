import { Adoption } from "src/adoptions/entities/adoptions.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, OneToMany, OneToOne } from "typeorm";
import { UserInformation } from "./user-information.entity";
import { City } from "src/city/entities/city.entity";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    creation_date: Date;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({ unique: true, length: 15 })
    phone_number: string;

    @Column()
    address: string;

    @Column()
    living_place: string;

    @Column({ name: 'fk_city_id', nullable: false })
    fk_city_id: number;

    @Column()
    has_pet: boolean;

    @ManyToMany(() => Pet, pet => pet.users)
    @JoinTable({ name: 'interested_users' })
    pets: Pet[];

    @OneToMany(() => Adoption, adoption => adoption.user)
    adoption: Adoption;

    @OneToOne(() => UserInformation, userInformation => userInformation.user)
    userinformation: UserInformation;

    @ManyToOne(() => City, city => city.users)
    @JoinColumn({ name: 'fk_city_id' })
    city: City;

    constructor(name: string, surname: string, phoneNumber: string, address: string, livingPlace?: string, hasPet?: boolean) {
        this.name = name;
        this.surname = surname;
        this.has_pet = hasPet;
        this.phone_number = phoneNumber;
        this.address = address;
        this.living_place = livingPlace;
    }

    public getId(): number {
        return this.id
    }

    public getName(): string {
        return this.name;
    }

    public getSurname(): string {
        return this.surname;
    }

    public getHasPet(): boolean {
        return this.has_pet;
    }
    public getPhoneNumber(): string {
        return this.phone_number;
    }

    public getAddress(): string {
        return this.address;
    }

    public getLivingPlace(): string {
        return this.living_place;
    }

    public getZipCode(): City {
        return this.city
    }

    public getInterestedPets(): Pet[] {
        return this.pets;
    }

    public setInterestedIn(newPets: Pet[]): void {
        this.pets = newPets;
    }
    public setPhoneNumber(newPhoneNumber: string): void {
        this.phone_number = newPhoneNumber;
    }

    public setAddress(newAddress: string): void {
        this.address = newAddress;
    }

    public setLivingPlace(newLivingPlace: string): void {
        this.living_place = newLivingPlace;
    }
}
