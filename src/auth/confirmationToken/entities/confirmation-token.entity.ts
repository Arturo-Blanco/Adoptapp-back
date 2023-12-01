import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { UserInformation } from 'src/users/entities/user-information.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class ConfirmationToken {
    @PrimaryColumn()
    user_id: number;

    @Column()
    token: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToOne(() => User, user => user.confirmationToken)
    @JoinColumn({ name: 'user_id' })
    user: User;
    
    constructor(token: string) {
        this.token = token;
    }

    public getUserId() : number {
        return this.user_id;
    }

    public getToken(): string {
        return this.token;
    }
}