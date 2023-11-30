import { Module } from '@nestjs/common';
import { NodeMailerService } from './nodeMailer.service';
import { NodeMailerController } from './nodeMailer.controller';

@Module({
    controllers: [NodeMailerController],
    providers: [ NodeMailerService ],
    exports: [ NodeMailerService]
})

export class NodeMailerModule {}
