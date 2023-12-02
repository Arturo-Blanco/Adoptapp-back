import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ConfirmationToken } from "./entities/confirmation-token.entity";
import { UserInformation } from "src/users/entities/user-information.entity";
import { User } from "src/users/entities/user.entity";

import { NodeMailerService } from "src/node-mailer/nodeMailer.service";
import * as crypto from 'crypto';

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
            if (!newToken) {
                throw new Error('Error generating token.')
            }
            newToken.user = user;

            return await this.confirmationTokenRepository.save(newToken);
        }
        catch (error) {
            throw new Error('Failed to create token' + error);
        }
    }

    async sendConfirmationEmail(email: string, token: string): Promise<boolean> {
        try {
            const confirmationLink = `http://localhost:3001/account/confirm?confirm_acount_token=${token}`;
            return await this.nodeMailerService.sendMail(email, confirmationLink);
        }
        catch (error) {
            throw new Error('Failed to send email' + error);
        }
    }

    async confirmationEmail(token: string): Promise<boolean> {
        try {
            const confirmationToken = await this.findToken(token);

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

    async sendResetPassword(email: string, token: string): Promise<boolean> {
        try {
            const confirmationLink = `http://localhost:3001/user/password/edit?reset_password_token=${token}`;
            return await this.nodeMailerService.sendMail(email, confirmationLink);
        }
        catch (error) {
            throw new Error('Failed to send email' + error);
        }
    }

    async findToken(token: string): Promise<ConfirmationToken> {
        try {
            const confirmationToken = await this.confirmationTokenRepository.findOne({ where: { token: token } });
            if (!confirmationToken) {
                throw new Error('Error getting token')
            }
            return confirmationToken;
        }
        catch (error) {
            throw new Error('Error getting token')
        }
    }
}