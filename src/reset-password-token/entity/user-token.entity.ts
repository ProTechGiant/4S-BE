import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { User } from "../../user/entity/user.entity";

@Entity("reset_password_token")
export class ResetPasswordToken extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @OneToOne(() => User, (user) => user.resetPasswordToken, { nullable: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column({ name: "password_token", type: "varchar" })
  passwordToken: string;
}
