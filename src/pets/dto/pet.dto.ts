import { City } from "src/city/entities/city.entity";
import { Attribute } from "../attributes/entities/attribute.entity";

export class CreatePetDTO {
    name: string;
    specie: string;
    sex: string;
    age: number;
    zipCode: number;
    attributes : Attribute[];
    description: string;
    urlImg: string;
}

export class PetDTO {
    id: number;
    name: string;
    sex: string;
    age: number;
    city: string;
    attributes: string[];
    description: string;
    urlImg: string;
    interested: number;
}