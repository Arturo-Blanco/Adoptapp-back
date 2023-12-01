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
    readonly roleId : number;
}