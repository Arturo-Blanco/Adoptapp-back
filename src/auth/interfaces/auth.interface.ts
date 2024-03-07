
export interface JWTPayload {
    readonly sub : string;
    readonly role: string;
    readonly email : string;
}

export interface AuthTokenResult {
    readonly sub : string;
    readonly role : string;
    readonly iat : number;
    readonly exp : number;
}

export interface IUseToken {
    readonly sub : string;
    readonly role : string;
    readonly isExpired : boolean;
}