
import { City } from "src/city/entities/city.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'informations' })
export class Information {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    information_date: Date;

    @Column()
    information_type: string;

    @Column()
    information_url: string;

    @Column()
    img_url: string;

    @Column()
    fk_city_id: number;

    @ManyToOne(() => City, city => city.informations)
    @JoinColumn({ name: 'fk_city_id' })
    city: City;
}