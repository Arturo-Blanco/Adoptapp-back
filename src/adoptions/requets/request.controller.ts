import { PublicAccess } from './../../auth/decorators/public.decorator';
import { Body, Controller, UseGuards, Post, Put } from "@nestjs/common";
import { RequestedPetsService } from "./request.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { RequestDTO } from "./dto/request.dto";
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('request')
@UseGuards(AuthGuard, RolesGuard)
export class RequestPetController {
    constructor(private readonly requestPetService: RequestedPetsService) { }

    @Roles('USER')
    @Post('addRequest')
    async getAddPet(@Body() body: RequestDTO): Promise<{ status: number, message: string }> {
        return await this.requestPetService.addRequest(body)
    }

    @Roles('USER', 'ADMIN')
    @Put('removeRequest')
    async getRemoveRequest(@Body() body: RequestDTO): Promise<string> {
        return await this.requestPetService.removeRequest(body);
    }
}