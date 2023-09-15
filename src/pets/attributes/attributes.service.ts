import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attribute } from "./entities/attribute.entity";
import { Repository } from "typeorm";
import { AttributeDTO } from "./dto/attribute.dto";

@Injectable()
export class AttributesService {

    constructor(@InjectRepository(Attribute)
    private readonly attributesRepository: Repository<Attribute>
    ) { }

    async addAttribute(attributeDTO: AttributeDTO): Promise<string> {
        try {
            const newAttribute: Attribute = await this.attributesRepository.save(new Attribute(attributeDTO.name));
            if (newAttribute) {
                return `Added new attribut ${attributeDTO.name}.`
            } else {
                throw new Error(`Error when adding attribut: ${attributeDTO.name}.`);
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error when adding attribut : ${attributeDTO.name} - ` + error,
            },
                HttpStatus.BAD_REQUEST);
        }
    }
}