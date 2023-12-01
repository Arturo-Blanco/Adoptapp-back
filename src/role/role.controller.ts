import { Body, Controller, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleDTO } from "./dto/role.dto";
import { Role } from "./entities/role.entity";

@Controller('role')
export class RoleController {
    constructor( private readonly roleService : RoleService) {}

    @Post('add')
    async getAddRole(@Body() roleDTO : RoleDTO) : Promise <Role> {
        return await this.roleService.addRole(roleDTO);
    }
}