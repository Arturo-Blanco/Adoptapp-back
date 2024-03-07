import { Pet } from "src/pets/entities/pet.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({ name: 'requested_pets' })
export class RequestedPet {
    @PrimaryColumn()
    pet_id: number;

    @PrimaryColumn()
    user_id: string;

    @CreateDateColumn()
    request_date: Date;

    @Column({ default: true })
    request_state: boolean;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Pet, pet => pet.request)
    @JoinColumn({ name : 'pet_id'})
    pet: Pet;

    @ManyToOne(() => User, user => user.request)
    @JoinColumn({ name : 'user_id'})
    user: User;

    
}