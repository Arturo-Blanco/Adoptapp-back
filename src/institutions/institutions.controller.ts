import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common/decorators";
import { InstitutionService } from "./institutions.service";
import { CreateInstitutionDTO, UpdateInstitutionDTO } from "./dto/institution.dto";
import { Institution } from "./entities/institution.entity";
import { ParseIntPipe } from "@nestjs/common";

@Controller('institution')
export class InstitutionController {
    constructor(private readonly institutionService: InstitutionService) { }

    @Post('addInstitution')
    async getAddInstitution(@Body() createInstitutionDTO: CreateInstitutionDTO): Promise<Institution> {
        return await this.institutionService.addInstitution(createInstitutionDTO);
    }

    @Get('all')
    async getAllInstitution(): Promise<Institution[]> {
        return await this.institutionService.allInstitution();
    }

    @Get(':institutionId')
    async getInstitutionById(@Param('institutionId', ParseIntPipe) institutionId: number): Promise<Institution> {
        return await this.institutionService.getById(institutionId);
    }

    @Patch('update/:institutionId')
    async getUpdateInstitution(@Param('institutionId', ParseIntPipe) institutionId: number, @Body() updateInstitutionDTO: UpdateInstitutionDTO): Promise<string> {
        return await this.institutionService.updateInstitution(institutionId, updateInstitutionDTO);
    }

    @Delete('delete/:institutionId')
    async getDeleteInstitution(@Param('institutionId', ParseIntPipe) institutionId: number): Promise<string> {
        return await this.institutionService.deleteInstitution(institutionId);
    }
}