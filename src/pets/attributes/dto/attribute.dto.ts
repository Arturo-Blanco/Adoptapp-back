import { IsNotEmpty } from "class-validator";

export class AttributeDTO {
    @IsNotEmpty()
    readonly name : string;
}