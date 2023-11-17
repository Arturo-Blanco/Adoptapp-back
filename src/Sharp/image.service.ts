import { Injectable } from "@nestjs/common";

@Injectable()
export class ImageService {

    private sharp = require('sharp')
    /**
     * Function to process an image before to save it
     * @param {inputBuffer}  expect for a buffer input to be processed
     * @returns {Promise <Buffer>} returns a processed image
     */
    async processImage(inputBuffer: Buffer): Promise<Buffer> {
        try {
            return await this.sharp(inputBuffer)
                .resize(400)
                .jpeg({ quality: 50 })
                .toBuffer()
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
        }
    }
}