import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Complainant } from "./complainant.entity";
import { City } from "src/city/entities/city.entity";

@Entity({name: 'complaints'})
export class Complaint {
    @PrimaryGeneratedColumn()
    id : number;

    @CreateDateColumn()
    complaint_date : Date;

    @Column()
    complaint_type : string;

    @Column()
    description: string;

    @Column()
    url_img: string;

    @Column()
    fk_city_id : number;

    @Column()
    fk_complainant_id : number;

    @ManyToOne(() => Complainant, complainant => complainant.complaints)
    @JoinColumn({name: 'fk_complainant_id'})
    complainants : Complainant;

    @ManyToOne(() => City, city => city.complaints)
    @JoinColumn({name : 'fk_city_id'})
    city : City;
}
