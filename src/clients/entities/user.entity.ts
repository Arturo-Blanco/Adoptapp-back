import { Adoption } from "src/adoptions/entities/adoptions.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, OneToMany, OneToOne } from "typeorm";
import { UserInformation } from "./user-information.entity";
import { Role } from "./role.entity";

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

    @Column()
    has_pet: boolean;

    @Column({ default: 3 })
    role_id: number;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToMany(() => Pet, pet => pet.users)
    @JoinTable({ name: 'interested_users' })
    pets: Pet[];

    @OneToMany(() => Adoption, adoption => adoption.user)
    adoption: Adoption;

    @OneToOne(() => UserInformation, userInformation => userInformation.user)
    userinformation: UserInformation;

    constructor(name: string, surname: string, hasPet: boolean) {
        this.name = name;
        this.surname = surname;
        this.has_pet = hasPet;
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

    public getInterestedPets(): Pet[] {
        return this.pets;
    }

    public setInterestedIn(newPets: Pet[]): void {
        this.pets = newPets;
    }
}
