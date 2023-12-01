import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ConfirmationToken } from "./entities/confirmation-token.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from 'crypto';
import { UserInformation } from "src/users/entities/user-information.entity";
import { NodeMailerService } from "src/node-mailer/nodeMailer.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class ConfirmationTokenService {
    constructor(
        private readonly nodeMailerService: NodeMailerService,
        @InjectRepository(ConfirmationToken)
        private readonly confirmationTokenRepository: Repository<ConfirmationToken>,
        @InjectRepository(UserInformation)
        private readonly userInformationRepository: Repository<UserInformation>
    ) { }

    async createToken(user: User): Promise<ConfirmationToken> {
        try {
            const token = crypto.randomBytes(32).toString('hex');
            const newToken: ConfirmationToken = new ConfirmationToken(token);
            newToken.user = user;
        
            return await this.confirmationTokenRepository.save(newToken);
        }
        catch (error) {
            throw new Error('Failed to create token' + error);
        }
    }

    async sendConfirmationEmail(email: string, token: string): Promise<boolean> {
        try {
            const confirmationLink = `http://localhost:3001/confirm?token=${token}`;
            return await this.nodeMailerService.sendMail(email, confirmationLink);
        }
        catch (error) {
            throw new Error('Failed to send email' + error);
        }
    }

    async confirmationEmail(token: string): Promise<boolean> {
        try {
            const confirmationToken = await this.confirmationTokenRepository.findOne({ where: { token: token } });
            console.log(confirmationToken)
            if (confirmationToken) {
                const user = await this.userInformationRepository.findOne({ where: { user_id: confirmationToken.getUserId() } })
                user.setState();
                await this.userInformationRepository.save(user);
                await this.confirmationTokenRepository.remove(confirmationToken);
                return true;
            }

            return false;
        }
        catch (error) {
            throw new Error('Failed to confirm email' + error);
        }
    }
}