import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from './firebase.config';

@Injectable()
export class FirebaseStorageService {
    private storage = getStorage(app)

    /**
    * Function to save images to Firebase 
    * @param filename image name
    * @param fileBuffer expects a buffer type input, in this case the processed image is passed
    * @returns {Promise <string>} returns file hosting url in Firebase
    */
    async uploadFile(fileName: string, fileBuffer: Buffer): Promise<string> {

        try {
            const imagesRef = ref(this.storage, `complaints/${fileName}`);
            const url = uploadBytes(imagesRef, fileBuffer).then(() => {
                return getDownloadURL(ref(this.storage, `complaints/${fileName}`))
            })
            return url
        } catch (error) {
            new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'Error en la carga de la imagen' + error
            }, HttpStatus.BAD_REQUEST);
        }
    }

}

