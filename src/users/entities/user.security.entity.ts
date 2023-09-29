import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name : 'user_security'})
export class UserSecurity {

    @PrimaryColumn()
    user_id: number;

    @Column({type: 'boolean', default : false})
    state : boolean;

    @Column()
    registration_user : string;

    @Column()
    password : string;

    @Column() 
    security_token : string;

    @OneToOne(() => User, user => user.user_security)
    @JoinColumn({ name : 'user_id'})
    user_data : User;

}