import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { RoleResourcePermission } from "../../role-resource-permission/entity/role-resource-permission.entity";

@Entity({ name: "resource" })
export class Resource extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "name", type: "varchar", unique: true })
  name: string;

  @OneToMany(() => RoleResourcePermission, (roleResourcePermission) => roleResourcePermission.resource, { nullable: false })
  roleResourcePermission: RoleResourcePermission[];
}
