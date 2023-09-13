import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: 'attributes'})
export class Attribut {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name : string;

    constructor(name: string) {
        this.name = name;
    }
    public getAttribut() : string {
        return this.name;
    }
    public setAttribut(newName: string) : void {
        this.name = newName;
    }
}