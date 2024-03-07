import { BadGatewayException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pet } from "src/pets/entities/pet.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource, FindOneOptions, Repository } from "typeorm";
import { RequestDTO } from "./dto/request.dto";
import { RequestedPet } from "./entities/request.entity";

@Injectable()
export class RequestedPetsService {
    constructor(
        @InjectRepository(Pet)
        private readonly petRepository: Repository<Pet>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(RequestedPet)
        private readonly requestRepository: Repository<RequestedPet>,
        private readonly dataSource: DataSource
    ) { }

    async addRequest({ userId, petId }: RequestDTO): Promise<{ status: number, message: string }> {

        try {

            const requestCritera: FindOneOptions = { where: { pet_id: petId, user_id: userId } };
            const request: RequestedPet = await this.requestRepository.findOne(requestCritera);

            if (request && request.request_state === true) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: 'Request already registered',
                        message: 'You have already requested the adoption of this pet.',
                    },
                    HttpStatus.CONFLICT

                )
            }

            if (request && request.request_state === false) {
                request.request_state = true
                await this.requestRepository.save(request);
            }
            const userCriteria: FindOneOptions = { where: { id: userId }, relations: ['request'] };
            const user: User = await this.userRepository.findOne(userCriteria);

            // if user exist, is verified if does not have more than 3 requested pet
            if (user && user.request.length > 2) {
                throw new HttpException(
                    {
                        status: HttpStatus.TOO_MANY_REQUESTS,
                        error: 'Too Many Requests',
                        message: 'Maximum adoption requests reached.',
                    },
                    HttpStatus.TOO_MANY_REQUESTS

                )
            }

            const petCriteria: FindOneOptions = { where: { id: petId } };
            const pet = await this.petRepository.findOne(petCriteria);

            if (!pet) {
                throw new NotFoundException(`There is no pet with id ${petId}.`);
            }

            const newRequest: RequestedPet = new RequestedPet();
            newRequest.pet = pet;
            newRequest.user = user

            await this.dataSource.transaction(async (manager) => {
                await manager.save(User, user);
                await manager.save(RequestedPet, newRequest);
            })

            return {
                status: HttpStatus.OK,
                message: `New request registered.`
            }
        }
        catch (error) {
            throw new HttpException({
                status: error.status,
                error: 'Error adding new request',
                message: error.message,
            }, error.status);
        }
    }

    async removeRequest({ userId, petId, requestDescription }: RequestDTO): Promise<string> {
        try {
            if (petId === null || userId === null) {
                throw new Error('No request information requested.');
            }

            const requestCritera: FindOneOptions = { where: { pet_id: petId, user_id: userId } };
            const request: RequestedPet = await this.requestRepository.findOne(requestCritera);

            if (!request || request.request_state === false) {
                throw new Error(`The user does not have a registered pet with ID ${petId}.`);

            }
            const petCriteria: FindOneOptions = { where: { id: petId } };
            const pet = await this.petRepository.findOne(petCriteria);

            if (pet.interested <= 0) {
                throw new NotFoundException(`Pet does not have any interested.`);
            }

            if (requestDescription) {
                request.description = requestDescription
            }

            request.request_state = false;
            pet.removeInterested();
            await this.dataSource.transaction(async (manager) => {
                await manager.save(RequestedPet, request);
                await manager.save(Pet, pet);
            })

            return 'Request was removed succesfuly.'

        } catch (error) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Error getting user',
                message: error.message,
            }, HttpStatus.CONFLICT);
        }
    }

    async findRequest({ userId, petId }: RequestDTO): Promise<any> {
        try {

            const requestCritera: FindOneOptions = { where: { pet_id: petId, user_id: userId } };
            const request: RequestedPet = await this.requestRepository.findOne(requestCritera);

            if (request && request.request_state === true) {
                return true
            }

            if (!request || request.request_state === false) {
                return false
            }

            return request;

        } catch (error) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Error getting request',
                message: error.message,
            }, HttpStatus.CONFLICT);
        }
    }
}