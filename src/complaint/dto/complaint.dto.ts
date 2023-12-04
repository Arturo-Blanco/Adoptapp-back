export class ComplaintTypeDTO {
    readonly type: string;
}
export class ComplainantDTO {
    readonly email: string;
    readonly phoneNumber: string;
}
export class CreateComplaintDTO {
    readonly complaintDescription: string;
    readonly typeOfComplaint: string;
    readonly zipCode: number;
    readonly email: string;
    readonly phoneNumber: string;
    readonly petName?: string;
    readonly petSpecie?: string;
    readonly petAge?: number;
    readonly showComplaint?: boolean;
}

export class ComplaintDTO {
    readonly description: string;
    readonly type: string;
    readonly city: string;
    readonly img_url: string
    readonly phoneNumber?: string;
    readonly petName?: string;
    readonly petSpecie?: string;
    readonly petAge?: number;
}