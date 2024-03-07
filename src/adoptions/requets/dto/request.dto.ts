export class RequestDTO {
    readonly petId : number;
    readonly userId : string;
    readonly requestState? : boolean;
    readonly requestDescription? : string;
}