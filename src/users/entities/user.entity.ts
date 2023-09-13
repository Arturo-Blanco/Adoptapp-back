import { City } from "src/city/entities/city.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    age: number;

    @Column({ unique: true })
    email: string;

    @Column()
    phoneNumber: number;

    @Column()
    address: string;

    @ManyToOne(() => City, city => city.users)
    @JoinColumn({ name: 'fk_city_id' })
    public city: City;

    @Column()
    hasPet: boolean;

    @Column()
    livingPlace: string;

    @Column()
    interestedIn: number;

    constructor(fullname: string, age: number, email: string, phoneNumber: number, address: string, hasPet: boolean, livingPlace: string, interestedIn: number) {
        this.fullname = fullname;
        this.age = age;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.hasPet = hasPet;
        this.livingPlace = livingPlace;
        this.interestedIn = interestedIn;
    }
    public getFullname(): string {
        return this.fullname;
    }
    public getAge(): number {
        return this.age
    }
    public getEmail(): string {
        return this.email;
    }
    public getPhoneNumber(): number {
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
    public getInterestedIn(): number {
        return this.interestedIn;
    }
    public getZipCode(): City {
        return this.city
    }
    public setAge(newAge: number): void {
        this.age = newAge;
    }
    public setEmail(newEmail: string): void {
        this.email = newEmail;
    }
    public setPhoneNumber(newPhoneNumber: number): void {
        this.phoneNumber = newPhoneNumber;
    }
    public setAddress(newAddress: string): void {
        this.address = newAddress;
    }
    public setLivingPlace(newLivingPlace: string): void {
        this.livingPlace = newLivingPlace;
    }
    public setInterestedIn(newPet: number): void {
        this.interestedIn = newPet;
    }
}
