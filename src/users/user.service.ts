import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDTO, UserWithPet } from './dto/user.dto';
import { checkEmptyValues, checkValues } from 'src/functions/valuesValidation';
import { Pet } from 'src/pets/entities/pet.entity';
import { CityService } from 'src/city/city.service';
import { City } from 'src/city/entities/city.entity';
import { UserInformation } from './entities/user-information.entity';
import { RoleDTO } from 'src/role/dto/role.dto';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';
import { ConfirmationTokenService } from 'src/auth/confirmationToken/confirmation-token.service';
import { ConfirmationToken } from 'src/auth/confirmationToken/entities/confirmation-token.entity';
import { LoginDTO } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    private readonly cityService: CityService,
    private readonly roleService: RoleService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    private readonly confirmationTokenService: ConfirmationTokenService,
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
    @InjectRepository(ConfirmationToken)
    private readonly confirmationTokenRepository: Repository<ConfirmationToken>
  ) { }

  validValues = ['name', 'surname', 'phoneNumber', 'address', 'zipCode'];

  async addUser(userDTO: CreateUserDTO): Promise<User> {
    const { name, surname, phoneNumber, address, zipCode, hasPet, livingPlace } = userDTO;

    try {

      // Check if required values are missing
      if (!checkValues(userDTO, this.validValues)) {
        throw new Error('Required fields missing: name, surname, phoneNumber, address, zipCode, hasPet, livingPlace.');
      };
      // Check if empty values are not accepted
      if (!checkEmptyValues(userDTO)) {
        throw new Error('Empty fields are not accepted.');
      }
      const city: City = await this.cityService.findByZip(zipCode);
      const newUser: User = new User(name, surname, phoneNumber, address, livingPlace, hasPet);

      if (!newUser) {
        throw new Error('Error adding new user.');
      }
      newUser.fk_city_id = city.getId();
      return await this.userRepository.save(newUser);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error adding new user',
        message: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addPet({ userId, petId }: UserWithPet): Promise<{ status: number, message: string }> {

    try {
      if (petId === null) {
        throw new Error('No pet information requested.');
      }

      const petCriteria: FindOneOptions = { where: { id: petId } };
      const existingPet = await this.petRepository.findOne(petCriteria);
      const user: User = await this.findById(userId);

      // if user exist, is verified if does not have more than 3 requested pet
      if (user && user.pets.length > 2) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Maximum adoption requests reached.'
        };
      } else {

        const petRequested = user.pets.map(pet => pet.id);

        if (petRequested.includes(petId)) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'You are already registered to adopt this pet.'
          };
        } else {
          petRequested.push(petId);
        }

        const petCriteria: FindManyOptions = { where: petRequested.map(petId => ({ id: petId })) };
        const requestedPet = await this.petRepository.find(petCriteria);

        user.setInterestedIn(requestedPet);
        existingPet.setInterested();

        await this.userRepository.save(user);
        await this.petRepository.save(existingPet);
        return { 
          status: HttpStatus.OK, 
          message: `${user.getSurname()} ${user.getName()} is interested in adopting another pet.` 
        }
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error adding new user',
        message: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // Function to get all users with their relasionship
  async allUsers(): Promise<User[]> {
    try {
      const criterion: FindManyOptions = { relations: ['pets'] };
      const allUsers: User[] = await this.userRepository.find(criterion);

      if (!allUsers) {
        throw new Error(`Could not get user data.`);
      }
      return allUsers;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting users',
        message: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }
  //Function to get user by ID
  async findById(userId: number): Promise<User> {
    try {
      const criterion: FindOneOptions = { relations: ['pets', 'city'], where: { id: userId } };
      const user: User = await this.userRepository.findOne(criterion);

      if (!user) {
        throw new NotFoundException(`There is no user with ID ${userId}.`);
      }
      return user;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting user',
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
  //Function to get user by email
  async findEmail(userEmail: string): Promise<UserInformation> {
    try {
      const criterion: FindOneOptions = { where: { email: userEmail }, relations: ['user'] };
      const user: UserInformation = await this.userInformationRepository.findOne(criterion);

      if (!user) {
        throw new NotFoundException(`There is no user with email ${userEmail}.`);
      }
      return user;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
  // Function to delete user by email
  async deleteUser(userEmail: string): Promise<string> {
    try {
      const user: UserInformation = await this.findEmail(userEmail);
      user.is_active = false;

      await this.userInformationRepository.save(user);

      return `${userEmail} was deleted from database.`;

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting user',
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
  //Function to remove a requested pet
  async removePet({ userId, petId }: UserWithPet): Promise<string> {
    try {
      const user: User = await this.findById(userId);
      const petCriteria: FindOneOptions = { where: { id: petId } };
      const existingPet = await this.petRepository.findOne(petCriteria);

      if (!existingPet) {
        throw new Error(`There is no pet with ID ${petId}.`);
      }

      const requestedPet = user.pets.map(pet => pet.id);

      if (!requestedPet.includes(petId)) {
        throw new Error(`The user ${user.getSurname()} ${user.getName()} does not have a registered pet with ID ${petId}.`);

      } else {

        const indexPet = requestedPet.indexOf(petId);
        requestedPet.splice(indexPet, 1);

        const petCriteria: FindManyOptions = { where: requestedPet.map(petId => ({ id: petId })) };
        const newPets = await this.petRepository.find(petCriteria);
        user.setInterestedIn(newPets);

        // If the user does not have a requested pet, an empty array is assigned
        if (requestedPet.length === 0) {
          user.pets = [];
        }
        existingPet.interested -= 1;

        await this.petRepository.save(existingPet);
        await this.userRepository.save(user);

        return `The pet with id ${petId} was remove from user ${user.getSurname()} ${user.getName()}.`
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Error getting user',
        message: error.message,
      }, HttpStatus.CONFLICT);
    }
  }
  //Function to get user information by ID
  async findInformation(userId: number): Promise<UserInformation> {
    try {
      const criteria: FindOneOptions = { where: { user_id: userId }, relations: ['role'] }
      const information: UserInformation = await this.userInformationRepository.findOne(criteria);
      if (!information) {
        throw new NotFoundException(`There is no user with id ${userId}.`);
      }
      return information;
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Error getting user',
        message: error.message,
      }, HttpStatus.CONFLICT);
    }
  }
  //Function to change the user role
  async changeRole(userId: number, role: RoleDTO): Promise<string> {
    try {
      const user: UserInformation = await this.findInformation(userId);
      const newRole: Role = await this.roleService.find(role.role);

      user.role = newRole;
      await this.userInformationRepository.save(user);

      return `User role was updated`
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error updating role',
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  //funtion to restore pass
  async restorePass({ email }: LoginDTO): Promise<string> {
    try {
      const user: UserInformation = await this.findEmail(email);
      const token = await this.confirmationTokenService.createToken(user.user);
      await this.confirmationTokenService.sendResetPassword(email, token.getToken());

      return 'Mail sent'
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error resetting password',
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  // function to change password
  async changePassword(token: string, { password }: LoginDTO): Promise<string> {
    try {
      const existingToken = await this.confirmationTokenRepository.findOne({ where: { token: token } })

      if (!existingToken) {
        throw new UnauthorizedException('Token is expired.')
      }

      const user: UserInformation = await this.userInformationRepository.findOne({ where: { user_id: existingToken.user_id } })

      const salt = await bcrypt.genSalt();
      const encriptPassword = await bcrypt.hash(password, salt);

      user.password = encriptPassword;
      await this.userInformationRepository.save(user);
      await this.confirmationTokenRepository.remove(existingToken);

      return 'Password restored.'
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error updating role',
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

}
