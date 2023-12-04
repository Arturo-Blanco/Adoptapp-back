import { Controller, Get, Param, Query } from "@nestjs/common";
import { ConfirmationTokenService } from "./confirmation-token.service";

@Controller('account')
export class ConfirmationTokenController {
    constructor(private readonly confirmationTokenService: ConfirmationTokenService) { }

    @Get('confirm')
    async getConfirmEmail(@Query('confirm_acount_token') token : string) : Promise <string> {
        return await this.confirmationTokenService.confirmationEmail(token);
    }
}