import { AuthTokenResult, IUseToken } from "src/auth/interfaces/auth.interface";
import * as jwt from 'jsonwebtoken'

export const useToken = (token: string) : IUseToken | string => {
    try {
        const decode = jwt.decode(token) as unknown as AuthTokenResult;

        const currentDate = new Date();
        const expireDate = new Date(decode.exp)
        return {
            sub : decode.sub,
            role: decode.role,
            isExpired : +currentDate <= +expireDate / 1000
        }
    } catch(error) {
        throw new Error('Invalid Token')
    }
}