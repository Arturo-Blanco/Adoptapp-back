import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Information } from "./information.entity";

@Entity({ name: 'information_types' })
export class InformationType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @OneToMany(() => Information, information => information.informationType)
    informations: Information[];

}