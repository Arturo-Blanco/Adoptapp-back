import { City } from "src/city/entities/city.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    creationDate: Date;

    @Column()
    fullname: string;

    @Column()
    age: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true, length: 10 })
    phoneNumber: string;

    @Column()
    address: string;

    @Column()
    hasPet: boolean;

    @Column()
    livingPlace: string;

    @ManyToMany(() => Pet, pet => pet.users)
    @JoinTable({ name: 'interested_users' })
    pets: Pet[];

    @Column({ name: 'fk_city_id', nullable: false })
    fk_city_id: number;

    @ManyToOne(() => City, city => city.users)
    @JoinColumn({ name: 'fk_city_id' })
    city: City;

    constructor(fullname: string, age: number, email: string, phoneNumber: string, address: string, city: City, hasPet: boolean, livingPlace: string, pets: Pet[]) {
        this.fullname = fullname;
        this.age = age;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.hasPet = hasPet;
        this.livingPlace = livingPlace;
        this.pets = pets;
    }
    public getFullname(): string {
        return this.fullname;
    }
    public getAge(): number {
        return this.age
    }
    public getZipCode(): City {
        return this.city
    }
    public getEmail(): string {
        return this.email;
    }
    public getPhoneNumber(): string {
        return this.phoneNumber;
    }
    public getAddress(): string {
        return this.address;
    }
    public getHasPet(): boolean {
        return this.hasPet;
    }
    public getLivingPlace(): string {
        return this.livingPlace;
    }
    public getInterestedPets(): Pet[] {
        return this.pets;
    }
    public setAge(newAge: number): void {
        this.age = newAge;
    }
    public setEmail(newEmail: string): void {
        this.email = newEmail;
    }
    public setPhoneNumber(newPhoneNumber: string): void {
        this.phoneNumber = newPhoneNumber;
    }
    public setAddress(newAddress: string): void {
        this.address = newAddress;
    }
    public setLivingPlace(newLivingPlace: string): void {
        this.livingPlace = newLivingPlace;
    }
    public setInterestedIn(newPets : Pet[]) : void {
        this.pets = newPets;
    }
}
