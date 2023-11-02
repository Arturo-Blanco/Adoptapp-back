export class CreateComplaintDTO {
    readonly type : string;
    readonly complaintDate : Date;
    readonly description : string;
    readonly imgUrl : string;
    readonly complaintType : number;
    readonly complaintCity : number;
    readonly complainant_email : string;
    readonly complainant_phoneNumber : string;
}