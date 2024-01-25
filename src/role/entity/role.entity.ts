import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { RoleResourcePermission } from "../../role-resource-permission/entity/role-resource-permission.entity";
import { UserRole } from "../../user-role/entity/user-role.entity";

@Entity({ name: "role" })
export class Role extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "name", type: "varchar" })
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRole: UserRole[];

  @OneToMany(() => RoleResourcePermission, (roleResourcePermission) => roleResourcePermission.role)
  roleResourcePermission: RoleResourcePermission[];
}
