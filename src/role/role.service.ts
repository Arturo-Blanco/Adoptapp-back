import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Repository } from "typeorm";
import { RoleDTO } from "./dto/role.dto";

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async addRole(roleDTO: RoleDTO): Promise<Role> {
        try {
            const newRole: Role = new Role(roleDTO.role);
            if (!newRole) {
                throw new Error('Error adding new role.');
            }
            return await this.roleRepository.save(newRole)
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error adding new user',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async find(roleId : number) : Promise<Role> {
        try {
            const role : Role = await this.roleRepository.findOne({where : { id : roleId}});
            if(!role) {
                throw new NotFoundException(`There is no rol with id ${roleId}.`);
            }
            return role;
        }
        catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error adding new user',
                message: error.message,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}