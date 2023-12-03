export class ComplaintTypeDTO {
    readonly type: string;
}
export class ComplainantDTO {
    readonly email: string;
    readonly phoneNumber: string;
}
export class CreateComplaintDTO {
    readonly description: string;
    readonly petName? : string;
    readonly petSpecie? : string;
    readonly petAge? : number;
    readonly complaintType: string;
    readonly zipCode: number;
    readonly email: string;
    readonly phoneNumber: string;
}