import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "../../role/entities/role.entity";
import { Exclude } from "@nestjs/class-transformer";

@Entity({ name: 'users_information' })
export class UserInformation {

    @PrimaryColumn()
    user_id: string;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: 3 })
    role_id: number;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToOne(() => User, user => user.userInformation)
    @JoinColumn({ name: 'user_id' })
    user: User;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public getUserId(): string {
        return this.user_id;
    }

    public getEmail(): string {
        return this.email;
    }

    @Exclude()
    public getPassword(): string {
        return this.password;
    }

    public setEmail(newEmail: string): void {
        this.email = newEmail;
    }

    public setPassword(newPassword: string): void {
        this.password = newPassword;
    }
    
    public setState(): void {
        this.is_active = !this.is_active;
    }
}