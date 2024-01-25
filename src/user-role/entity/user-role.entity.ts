import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { EntityBase } from "../../base/entityBase";
import { User } from "../../user/entity/user.entity";
import { Site } from "../../site/entity/site.entity";
import { Role } from "../../role/entity/role.entity";

@Entity({ name: "user_role" })
export class UserRole extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "params", type: "json", nullable: true })
  params: string;

  @ManyToOne(() => User, (user) => user.userRole)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Site, (site) => site.userRole)
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;

  @ManyToOne(() => Role, (role) => role.userRole)
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  role: Role;
}
