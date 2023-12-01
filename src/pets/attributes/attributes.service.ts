import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attribute } from "./entities/attribute.entity";
import { FindOneOptions, Repository } from "typeorm";
import { AttributeDTO } from "./dto/attribute.dto";
import { NOTFOUND, promises } from "dns";

@Injectable()
export class AttributesService {

    constructor(@InjectRepository(Attribute)
    private readonly attributesRepository: Repository<Attribute>
    ) { }

    async addAttribute(attributeDTO: AttributeDTO): Promise<string> {
        try {
            if (!attributeDTO.name) {
                throw new Error('Missing field name.');
            }
            if (attributeDTO.name === " ") {
                throw new Error('Property name cannot be empty.');
            }
            const newAttribute: Attribute = await this.attributesRepository.save(new Attribute(attributeDTO.name));
            if (!newAttribute) {
                throw new Error(`Error when adding attribut: ${attributeDTO.name}.`);
            }
            return `Added new attribute: ${attributeDTO.name}`
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error when adding attribut : ${attributeDTO.name} - ` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }

    async allAttributes(): Promise<Attribute[] | string> {
        try {
            const attributes: Attribute[] = await this.attributesRepository.find();
            if (!attributes) {
                throw new Error('Error getting attributes.');
            }
            if (attributes.length === 0) {
                return `There are no attributes in the database.`
            }
            return attributes;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error getting attributes :` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }

    async getById(attributeId: number): Promise<Attribute> {
        try {
            const criteria: FindOneOptions = { where: { id: attributeId } };
            const attribute: Attribute = await this.attributesRepository.findOne(criteria);
            if (!attribute) {
                throw new NotFoundException(`There is no attribute with id : ${attributeId}`);
            }
            return attribute;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error getting attributes :` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    };

    async updateAttribute(attributeId: number, updateAttributeDTO: AttributeDTO): Promise<string> {
        try {
            const attribute: Attribute = await this.getById(attributeId);
            attribute.setAttribut(updateAttributeDTO.name);
            await this.attributesRepository.save(attribute);
            return `Attribute with id ${attributeId} was updated`;
        } catch (error) {
            if (error.status === 400) {
                throw new NotFoundException(`There is no attribute with id ${attributeId}.`);
            }
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error getting attributes :` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }

    async deleteAttribute(attributeId: number): Promise<string> {
        try {
            const attribute: Attribute = await this.getById(attributeId);
            await this.attributesRepository.remove(attribute);
            return `Attribute with id ${attributeId} was remove`;
        } catch (error) {
            if (error.status === 400) {
                throw new NotFoundException(`There is no attribute with id ${attributeId}.`);
            }
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: `Error getting attributes :` + error.message,
            },
                HttpStatus.BAD_REQUEST);
        }
    }
}