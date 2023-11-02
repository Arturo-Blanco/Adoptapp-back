import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity({ name: 'users' })
export class User {

    @PrimaryColumn()
    user_id: number;

    @Column({ type: 'boolean', default: false })
    state: boolean;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToOne(() => Client, client => client.user)
    @JoinColumn({ name: 'user_id' })
    client: Client;

}