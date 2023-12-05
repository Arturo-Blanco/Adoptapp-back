import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface"

export const CORS : CorsOptions = {
    origin: true,
    methods: 'HET, HEAD, PUT,PATCH,DELETE, POST, OPTIONS',
    credentials: true,
}