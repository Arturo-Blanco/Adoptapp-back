import { Controller, Get } from '@nestjs/common';
import { NodeMailerService } from './nodeMailer.service';

@Controller('nodeMailer')
export class NodeMailerController {
    constructor(private readonly nodeMailderService : NodeMailerService) {}

    @Get() 
    getSendMail(to: string) : any {
        return this.nodeMailderService.sendMail(to);
    }
}
