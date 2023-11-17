
export class CreatePetDTO {
    readonly name: string;
    readonly specie: string;
    readonly sex: string;
    readonly age: number;
    readonly attributes: string[];
    readonly description: string;
    readonly urlImg: string;
    readonly institution_id : number;
}

export class UpdatePetDTO {
    readonly name: string;
    readonly specie: string;
    readonly sex: string;
    readonly age: number;
    readonly attributes: string[];
    readonly description: string;
    readonly urlImg: string;
    readonly institution_id : number;
}

export class PetDTO {
    readonly id: number;
    readonly name: string;
    readonly sex: string;
    readonly age: number;
    readonly attributes: string[];
    readonly description: string;
    readonly urlImg: string;
    readonly interested: number;
    readonly institution : string;
}