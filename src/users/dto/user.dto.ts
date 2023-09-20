import { Pet } from "src/pets/entities/pet.entity";

export class CreateUserDTO {
    readonly fullname: string;
    readonly age: number;
    readonly email: string;
    readonly phoneNumber: string;
    readonly address: string;
    readonly zipCode: number;
    readonly hasPet: boolean;
    readonly livingPlace: string;
    readonly interestedIn: number;
}