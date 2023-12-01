export interface JWTPayload {
    readonly userId : number;
    readonly userEmail : string;
    readonly userName : string;
    readonly userSurname : string;
    readonly userRole : number;
}