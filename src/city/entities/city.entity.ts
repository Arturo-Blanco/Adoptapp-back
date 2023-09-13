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

    @OneToMany(() => Pet, pets => pets.city)
    @JoinColumn({name: 'fk_pet_id'})
    public pets: Pet[];

    @OneToMany(() => User, users => users.city)
    @JoinColumn({name: 'fk_user_id'})
    public users: Pet[];

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
