import { UserInformation } from 'src/clients/entities/user-information.entity';
import { Adoption } from "src/adoptions/entities/adoptions.entity";
import { Complaint } from "src/complaint/entities/complaint.entity";
import { Information } from "src/information/entities/information.entity";
import { Institution } from 'src/institutions/entities/institution.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: 'cities' })
export class City {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    zip_code: number

    @OneToMany(() => UserInformation, user => user.city)
    users: UserInformation[];

    @OneToMany(() => Adoption, adoption => adoption.city)
    adoption: Adoption[];

    @OneToMany(() => Complaint, complaint => complaint.city)
    complaints: Complaint[];

    @OneToMany(() => Information, information => information.city)
    informations: Information[];

    @OneToMany(() => Institution, institution => institution.city)
    institution: Institution[];

    constructor(name: string, zipCode: number) {
        this.name = name;
        this.zip_code = zipCode;
    }

    public getId(): number {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getZipCode(): number {
        return this.zip_code;
    }
    public setName(newName: string): void {
        this.name = newName;
    }
    public setZipCode(newZipCode: number): void {
        this.zip_code = newZipCode;
    }
}
