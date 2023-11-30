import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerService {

    private transporter: nodemailer.Transporter;

    confirmationURL = 'http://localhost:3000/'
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'hotmail', // Proveedor de correo
            auth: {
                user: 'blanco_a@hotmail.com.ar',
                pass: 'Adolf37182915',
            },
        });
    }

    async sendMail(to: string): Promise<any> {
        try {
            await this.transporter.sendMail({
                to: to,
                from: '"AdoptApp" blanco_a@hotmail.com.ar',
                subject: 'Confirmación de email',
                html: `
            <html>
                <head>
                    <meta property="og:title" content="Confirmación de email" />
                    <meta property="og:description" content="Haga click en el siguiente enlace para confirmar su dirección de email." />
                    <meta property="og:image" content="URL_DE_UNA_IMAGEN" />
                    <meta property="og:url" content="${this.confirmationURL}" />
                    <style>
                        /* Estilos para el encabezado h1 */
                        h1 {
                            color: #007bff;
                        }
                        /* Estilos para el párrafo */
                        p {
                            font-size: 16px;
                            line-height: 1.5;
                        }
                    </style>
                </head>
            <body>
                <p>Haga click en el siguiente enlace para confirmar su dirección de email.</p>
                <p><a href="${this.confirmationURL}">${this.confirmationURL}</a></p>
                <p>Este correo se generó automáticamente.</p>
            </body>
            </html>
                `
            });
            return 'Mail enviado correctamente';
        } catch (error){
            throw error;
        }
    }
}
