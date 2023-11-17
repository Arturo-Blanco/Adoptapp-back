export class ComplaintTypeDTO {
    readonly type: string;
}
export class ComplainantDTO {
    readonly email: string;
    readonly phoneNumber: string;
}
export class CreateComplaintDTO {
    readonly type: string;
    readonly complaintDate: Date;
    readonly description: string;
    readonly imgUrl: string;
    readonly complaintType: number;
    readonly complaintCity: number;
    readonly complainantEmail: string;
    readonly complainantPhoneNumber: string;
}