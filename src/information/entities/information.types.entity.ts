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

    constructor(type: string) {
        this.type = type;
    }
    public getId(): number {
        return this.id;
    }
    public getType(): string {
        return this.type;
    }
    public setType(newType: string): void {
        this.type = newType;
    }
}