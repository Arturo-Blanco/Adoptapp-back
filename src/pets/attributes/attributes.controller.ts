import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AttributesService } from './attributes.service';
import { AttributeDTO } from "./dto/attribute.dto";
import { Attribute } from "./entities/attribute.entity";

@Controller('attribute')
export class AttributesController {
    constructor(private readonly attributesService: AttributesService) { }

    @Post('add')
    @UsePipes(ValidationPipe)
    async getAddAttribut(@Body() attributeDTO: AttributeDTO): Promise<string> {
        return await this.attributesService.addAttribute(attributeDTO);
    }

    @Get('all')
    async getAttributes(): Promise<Attribute[] | string> {
        return await this.attributesService.allAttributes();
    }

    @Get(':attributeId')
    async getAttributeById(@Param('attributeId', ParseIntPipe) attributeId: number): Promise<Attribute> {
        return await this.attributesService.getById(attributeId);
    }

    @Patch('update/:id')
    async getUpdateAttribute(@Param('id', ParseIntPipe) attributeId: number, @Body() updateAttributeDTO: AttributeDTO): Promise<string> {
        return await this.attributesService.updateAttribute(attributeId, updateAttributeDTO);
    }

    @Delete('delete/:attributeId')
    async getDeleteAttribute(@Param('attributeId', ParseIntPipe) attributeId: number): Promise<string> {
        return await this.attributesService.deleteAttribute(attributeId);
    }

}   