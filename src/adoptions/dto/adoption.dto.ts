export class AdoptionDTO {
    readonly userId : string;
    readonly petId : number;
    readonly zipCode : number;
}

export class RequestedPetsDTO {
    readonly petId : number;
    readonly userId : string;
    readonly userName : string;
    readonly userCity : string;
    readonly petName : string;
    readonly petSpecie : string;
    readonly petInstitution : string;
}