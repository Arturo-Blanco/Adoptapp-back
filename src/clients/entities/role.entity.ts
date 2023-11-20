import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'roles' })
export class Role {
    @PrimaryColumn()
    id: number;

    @Column()
    role: string;

    @OneToMany(() => User, user => user.role)
    users: User[]

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