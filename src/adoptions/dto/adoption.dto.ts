export class AdoptionDTO {
    readonly userId : number;
    readonly petId : number;
    readonly zipCode : number;
}

export class RequestedPets {
    readonly petId : number;
    readonly userId : number;
    readonly userName : string;
    readonly userCity : string;
    readonly petName : string;
    readonly petSpecie : string;
    readonly petInstitution : string;
}