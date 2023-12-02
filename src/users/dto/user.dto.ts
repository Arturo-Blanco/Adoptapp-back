import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDTO {
    readonly name: string;
    readonly surname: string;
    readonly email: string;
    readonly password : string;
    readonly phoneNumber: string;
    readonly address: string;
    readonly zipCode: number;
    readonly hasPet: boolean;
    readonly livingPlace: string;
    readonly role : string;
}

export class UserWithPet {
    readonly userId : number;
    readonly petId : number;
}