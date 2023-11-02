import { City } from "src/city/entities/city.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { Client } from "src/clients/entities/client.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'adoptions' })
export class Adoption {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    adoption_date: Date;

    @OneToOne(() => Pet, pet => pet.adoption)
    @JoinColumn({ name: 'pet_id' })
    pet: Pet;

    @ManyToOne(() => Client, client => client.adoption)
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @ManyToOne(() => City, city => city.adoption)
    @JoinColumn({ name: 'city_id' })
    city: City;
}