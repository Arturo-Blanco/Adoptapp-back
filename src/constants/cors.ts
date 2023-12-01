import { CorsOptions } from "vite";

export const CORS : CorsOptions = {
    origin: true,
    methods: 'HET, HEAD, PUT,PATCH,DELETE, POST, OPTIONS',
    credentials: true,
}