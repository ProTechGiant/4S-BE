import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { EntityBase } from "../../base/entityBase";
import { User } from "../../user/entity/user.entity";
import { UserProfileDtos } from "../dto/user-profile.dto";

@Entity({ name: "user_profile" })
export class UserProfile extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "notification_perferences", type: "json" })
  notificationPreferences: string;

  @Column("json", { name: "custom_data" })
  dashboard: UserProfileDtos.DashboardDto;

  @Column({ name: "image", type: "bytea", nullable: true })
  image: Buffer;

  @OneToOne(() => User, (user) => user.userProfile)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
