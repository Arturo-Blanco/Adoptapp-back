import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ComplainantService } from "../services/complainant.service";
import { Complainant } from "../entities/complainant.entity";
import { ComplainantDTO } from "../dto/complaint.dto";

@Controller('complainant')
export class ComplainantController {
    constructor(private readonly complainantService: ComplainantService) { }

    @Post('add')
    async getAddComplainant(@Body() complainantDTO: ComplainantDTO): Promise<Complainant> {
        return await this.complainantService.createComplainant(complainantDTO);
    }

    @Get('all')
    async getAll(): Promise<Complainant[]> {
        return await this.complainantService.findAll();
    }

    @Get('findById/:id')
    async getFinById(@Param('id', ParseIntPipe) complainantId: number): Promise<Complainant> {
        return await this.complainantService.findById(complainantId);
    }

    @Get('findByEmail/:email')
    async getFinByEmail(@Param('email') complainantEmail: string): Promise<Complainant> {
        return await this.complainantService.findByEmail(complainantEmail);
    }

    @Patch('update/:id')
    async getUpdateComplainant(@Param('id', ParseIntPipe) complainantId : number, @Body() complainantDTO : ComplainantDTO) : Promise <string> {
        return await this.complainantService.updateComplainant(complainantId, complainantDTO);
    }

    @Delete('delete/:id')
    async geDeleteComplainant(@Param('id', ParseIntPipe) complainantId : number) : Promise <string> {
        return await this.complainantService.deleteComplainant(complainantId);
    }
}