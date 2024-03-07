import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDTO, UserProfile } from './dto/user.dto';
import { checkEmptyValues, checkValues } from 'src/functions/valuesValidation';
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
import { RequestedPet } from 'src/adoptions/requets/entities/request.entity';

@Injectable()
export class UserService {

  constructor(
    private readonly cityService: CityService,
    private readonly roleService: RoleService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly confirmationTokenService: ConfirmationTokenService,
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
    @InjectRepository(ConfirmationToken)
    private readonly confirmationTokenRepository: Repository<ConfirmationToken>,
    @InjectRepository(RequestedPet)
    private readonly requestedPetsRepository: Repository<RequestedPet>
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
  async findById(userId: string): Promise<User> {
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
  async deleteUser(userId: string): Promise<string> {
    try {
      const user: UserInformation = await this.findInformation(userId);
      user.is_active = false;

      await this.userInformationRepository.save(user);

      return `User was deleted from database.`;

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting user',
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  //Function to get user information by ID
  async findInformation(userId: string): Promise<UserInformation> {
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

  //Function to get profile
  async findProfile(userId: string): Promise<any> {
    try {
      const criterion: FindOneOptions = { relations: ['city', 'userInformation'], where: { id: userId } };

      const requestedPets: RequestedPet[] = await this.requestedPetsRepository.find({ where : { user_id : userId,request_state : true}, relations: ['pet', 'pet.institution', 'pet.institution.city']})
      const user: User = await this.userRepository.findOne(criterion);

      if (!user) {
        throw new NotFoundException(`There is no user with ID ${userId}.`);
      }

      const userProfile: UserProfile = {
        name: user.name,
        surname: user.surname,
        createAt: user.creation_date,
        email: user.userInformation.email,
        phoneNumber: user.phone_number,
        address: user.address,
        hasPet: user.has_pet,
        livingPlace: user.living_place,
        city: user.city.name,
        pets: requestedPets.map(pet => ({
          id: pet.pet.id,
          name: pet.pet.name,
          sex: pet.pet.sex,
          specie: pet.pet.specie,
          age: pet.pet.age,
          urlImg: pet.pet.url_img,
          institution: pet.pet.institution.name,
          city: pet.pet.institution.city.name
        }))
      }
      return userProfile;
    } catch (error) {
      console.log(error)
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error getting user',
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
  //Function to change the user role
  async changeRole(userId: string, role: RoleDTO): Promise<string> {
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
  async sentTokenPasswordRestore({ email }: LoginDTO): Promise<string> {
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
  async passwordRestoration(token: string, { password }: LoginDTO): Promise<string> {
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
