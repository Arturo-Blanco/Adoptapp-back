import { City } from "src/city/entities/city.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'institutions' })
export class Institution {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: false })
    fk_city_id: number;

    @ManyToOne(() => City, city => city.institution)
    @JoinColumn({ name: 'fk_city_id' })
    city: City;

    @OneToMany(() => Pet, pet => pet.institution)
    pets: Pet[];

    constructor(name: string) {
        this.name = name;
    }

    public getId() : number {
        return this.id;
    }
    public getName() : string {
        return this.name;
    }
    public setName(newName: string) : void {
        this.name = newName;
    }
}