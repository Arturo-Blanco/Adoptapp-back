import { Adoption } from "src/adoptions/entities/adoptions.entity";
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany, OneToOne } from "typeorm";
import { UserInformation } from "./user-information.entity";
import { City } from "src/city/entities/city.entity";
import { ConfirmationToken } from "src/auth/confirmationToken/entities/confirmation-token.entity";
import { RequestedPet } from "src/adoptions/requets/entities/request.entity";
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'users' })
export class User {

    @PrimaryColumn()
    id: string = uuidv4();

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

    @OneToMany(() => RequestedPet, request => request.user)
    request: RequestedPet[];

    @OneToMany(() => Adoption, adoption => adoption.user)
    adoption: Adoption;

    @OneToOne(() => UserInformation, userInformation => userInformation.user)
    userInformation: UserInformation;

    @OneToOne(() => ConfirmationToken, confirmationToken => confirmationToken.user)
    confirmationToken: ConfirmationToken;

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

    public getId(): string {
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

    public getInterestedPets(): RequestedPet[] {
        return this.request;
    }

    public setInterestedIn(newPets: RequestedPet[]): void {
        this.request = newPets;
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
