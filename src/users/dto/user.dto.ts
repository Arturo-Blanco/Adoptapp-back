import { PetDTO } from "src/pets/dto/pet.dto";

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

export class UserProfile {
    readonly name: string;
    readonly createAt : Date;
    readonly surname: string;
    readonly email: string;
    readonly phoneNumber : string;
    readonly address : string;
    readonly hasPet : boolean;
    readonly livingPlace : string;
    readonly city : string;
    readonly pets : {
        id: number,
        name: string,
        sex: string,
        specie : string,
        age: number,
        urlImg: string,
        institution : string,
        city : string,
    }[]
}