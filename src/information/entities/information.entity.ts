
import { City } from "src/city/entities/city.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InformationType } from "./information.types.entity";

@Entity({ name: 'informations' })
export class Information {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    information_date: Date;

    @Column()
    information_url: string;

    @Column()
    img_url: string;

    @Column()
    fk_information_type_id: number;

    @Column()
    fk_city_id: number;

    @ManyToOne(() => InformationType, informationType => informationType.informations)
    @JoinColumn({ name: 'fk_information_type_id' })
    informationType: InformationType;

    @ManyToOne(() => City, city => city.informations)
    @JoinColumn({ name: 'fk_city_id' })
    city: City;
}