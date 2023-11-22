import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "../../role/entities/role.entity";
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users_information' })
export class UserInformation {

    @PrimaryColumn()
    user_id: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column()
    password: string;

    @BeforeInsert()
    async hasPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt)
    }

    async validatePassword(password: string): Promise<boolean> {
        console.log(password)
        return await bcrypt.compareSync(password, this.password);
    }

    @Column({ unique: true })
    email: string;

    @Column({ default: 3 })
    role_id: number;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToOne(() => User, user => user.userinformation)
    @JoinColumn({ name: 'user_id' })
    user: User;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public setEmail(newEmail: string): void {
        this.email = newEmail;
    }

    public setPassword(newPassword: string): void {
        this.password = newPassword;
    }
}