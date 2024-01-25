import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, Index } from "typeorm";
import { EntityBase } from "../../base/entityBase";
import { Resource } from "../../resource/entity/resource.entity";
import { Role } from "../../role/entity/role.entity";

@Entity({ name: "role_resource_permission" })
@Index("unique_role_resource", ["role", "resource"], { unique: true })
export class RoleResourcePermission extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "can_write", type: "boolean", nullable: true })
  canWrite: boolean;

  @Column({ name: "can_read", type: "boolean", nullable: true })
  canRead: boolean;

  @Column({ name: "can_update", type: "boolean", nullable: true })
  canUpdate: boolean;

  @Column({ name: "can_delete", type: "boolean", nullable: true })
  canDelete: boolean;

  @ManyToOne(() => Role, (role) => role.roleResourcePermission, { nullable: false })
  @JoinColumn({ name: "role_id", referencedColumnName: "id" })
  role: Role;

  @ManyToOne(() => Resource, (resource: Resource) => resource.roleResourcePermission, { nullable: false })
  @JoinColumn({ name: "resource_id", referencedColumnName: "id" })
  resource: Resource;
}
