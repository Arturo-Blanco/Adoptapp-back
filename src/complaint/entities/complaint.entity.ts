import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Complainant } from "./complainant.entity";
import { City } from "src/city/entities/city.entity";
import { ComplaintType } from "./complaint.types.entity";

@Entity({ name: 'complaints' })
export class Complaint {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    complaint_date: Date;

    @Column()
    description: string;

    @Column()
    img_url: string;

    @Column()
    fk_complaint_type_id: number;

    @Column()
    fk_city_id: number;

    @Column()
    fk_complainant_id: number;

    @ManyToOne(() => ComplaintType, complaintType => complaintType.complaints)
    @JoinColumn({ name: 'fk_complaint_type_id' })
    complaintType: ComplaintType;

    @ManyToOne(() => Complainant, complainant => complainant.complaints)
    @JoinColumn({ name: 'fk_complainant_id' })
    complainants: Complainant;

    @ManyToOne(() => City, city => city.complaints)
    @JoinColumn({ name: 'fk_city_id' })
    city: City;

    constructor(complaintDate : Date, description: string, imgUrl : string) {
        this.complaint_date = complaintDate;
        this.description = description;
        this.img_url = imgUrl;
    }

    public getId(): number {
        return this.id;
    }
    public getComplaintDate(): Date {
        return this.complaint_date;
    }
    public getDescription(): string {
        return this.description;
    }
    public getImgUrl(): string {
        return this.img_url;
    }
    public getComplaintType(): ComplaintType {
        return this.complaintType;
    }
    public getComplainant(): Complainant {
        return this.complainants;
    }
    public setDate(newDate : Date): void {
        this.complaint_date = newDate;
    }
    public setDescription(newDescription : string): void {
        this.description = newDescription;
    }
    public setUrlImg(newImgUrl : string) : void {
        this.img_url = newImgUrl;
    }
}
