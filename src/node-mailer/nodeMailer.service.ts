import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerService {

    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'hotmail', // Proveedor de correo
            auth: {
                user: 'blanco_a@hotmail.com.ar',
                pass: 'Adolf37182915',
            },
        });
    }

    async sendMail(to: string, confirmationURL : string): Promise<any> {
        try {
            let subject = '';
            let message = '';

            if(confirmationURL.includes('confirm_acount_token')) {
                subject = 'Confirmacion de cuenta'
                message =  
                `<p>Haga click en el siguiente enlace para confirmar su dirección de email.</p>
                <p><a href="${confirmationURL}">${confirmationURL}</a></p>
                <p>Este correo se generó automáticamente.</p>`
            }
            else if(confirmationURL.includes('reset_password_token')) {
                subject= 'Restablecimiento de contraseña'
                message =  
                `<p>
                Acabas de recibir este correo por que alguien solicito un restablecimiento de contraseña de tu cuenta de Adoptapp. Haga click en el siguiente enlace para continuar.</p>
                <p><a href="${confirmationURL}">${confirmationURL}</a></p>
                <p>Este correo se generó automáticamente, si no solicitaste el cambio de contraseña desestima este mensaje.</p>`
            }
            await this.transporter.sendMail({
                to: to,
                from: '"AdoptApp" blanco_a@hotmail.com.ar',
                subject: subject,
                html: `
            <html>
                <head>
                    <meta property="og:title" content="Confirmación de email" />
                    <meta property="og:description" content="Haga click en el siguiente enlace para confirmar su dirección de email." />
                    <meta property="og:image" content="URL_DE_UNA_IMAGEN" />
                    <meta property="og:url" content="${confirmationURL}" />
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
                ${message}
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
