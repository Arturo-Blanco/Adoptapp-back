import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserInformation } from "../../users/entities/user-information.entity";

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @OneToMany(() => UserInformation, user => user.role)
    users: UserInformation[]

    constructor(role: string) {
        this.role = role
    }

    public getId(): number {
        return this.id
    }

    public getRole(): string {
        return this.role;
    }

    public setRole(newRole: string) {
        this.role = newRole;
    }
}