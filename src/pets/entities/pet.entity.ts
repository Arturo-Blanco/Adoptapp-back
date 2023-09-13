import { City } from "src/city/entities/city.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'pets' })
export class Pet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    creationDate: Date;

    @Column()
    name: string;

    @Column()
    specie: string;

    @Column()
    sex: string;

    @Column()
    age: number;

    @ManyToOne(() => City, city => city.pets)
    @JoinColumn({ name: 'fk_city_id'})
    public city : City;

    @Column()
    description: string;

    @Column()
    urlImg: string;

    @Column()
    available: boolean;

    @Column()
    interested: number;

    constructor(name: string, age: number, specie: string, sex: string, description: string, urlImg: string) {
        this.name = name;
        this.age = age;
        this.specie = specie;
        this.sex = sex;
        this.description = description;
        this.urlImg = urlImg;
    }
    public getName(): string {
        return this.name;
    }
    public getAge(): number {
        return this.age;
    }
    public getSpecie(): string {
        return this.specie;
    }
    public getSex(): string {
        return this.sex;
    }
    public getDescription(): string {
        return this.description;
    }
    public getUrlImg(): string {
        return this.urlImg;
    }
    public getInterested(): number {
        return this.interested;
    }
    public setAge(newAge: number): void {
        this.age = newAge;
    }
    public setDescription(newDescription: string): void {
        this.description = newDescription;
    }
    public setInterested(): void {
        this.interested += 1;
    }
    public setUrlImg(newUrlImg: string): void {
        this.urlImg = newUrlImg;
    }
    public setAvailable(): void {
        !this.available;
    }
}
