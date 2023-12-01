import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { ComplaintTypeDTO } from "../dto/complaint.dto";
import { ComplaintTypeService } from "../services/complaintType.service";
import { ComplaintType } from "../entities/complaint.types.entity";

@Controller('complaintType')
export class ComplaintTypeController {
    constructor(private readonly complaintTypeService: ComplaintTypeService) { }

    @Post('addType')
    async getCreateComplaintType(@Body() createComplaintType: ComplaintTypeDTO): Promise<ComplaintType> {
        return await this.complaintTypeService.createType(createComplaintType);
    }

    @Get('all')
    async getAllTypes(): Promise<ComplaintType[]> {
        return await this.complaintTypeService.getAll();
    }

    @Get('typeId/:id')
    async getTypeById(@Param('id', ParseIntPipe) id: number): Promise<ComplaintType> {
        return await this.complaintTypeService.findById(id);
    }

    @Get('type/:type')
    async getTypeByName(@Param('type') type: string): Promise<ComplaintType> {
        return await this.complaintTypeService.findComplaintType(type);
    }

    @Patch('update/:typeId')
    async getUpdateType(@Param('typeId', ParseIntPipe) typeId: number, @Body() complaintType: ComplaintTypeDTO): Promise<string | ComplaintType> {
        return await this.complaintTypeService.updateType(typeId, complaintType);
    }

    @Delete('delete/:id')
    async getDeleteType(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return await this.complaintTypeService.deleteType(id);
    }
}

