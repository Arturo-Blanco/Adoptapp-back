import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { City } from "src/city/entities/city.entity";

@Entity({ name: 'users-information' })
export class UserInformation {

    @PrimaryColumn()
    user_id: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true, length: 15 })
    phone_number: string;

    @Column()
    address: string;

    @Column()
    living_place: string;

    @Column({ name: 'fk_city_id', nullable: false })
    fk_city_id: number;

    @OneToOne(() => User, user => user.userinformation)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => City, city => city.users)
    @JoinColumn({ name: 'fk_city_id' })
    city: City;
    
    constructor(email: string, phoneNumber: string, address: string, livingPlace: string) {
        this.email = email;
        this.phone_number = phoneNumber;
        this.address = address;
        this.living_place = livingPlace;
    }

    public getEmail(): string {
        return this.email;
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
    
    public setEmail(newEmail: string): void {
        this.email = newEmail;
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