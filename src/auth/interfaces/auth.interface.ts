
export interface JWTPayload {
    readonly sub : number;
    readonly role: string;
    readonly email : string;
}

export interface AuthTokenResult {
    readonly sub : number;
    readonly role : string;
    readonly iat : number;
    readonly exp : number;
}

export interface IUseToken {
    readonly sub : number;
    readonly role : string;
    readonly isExpired : boolean;
}