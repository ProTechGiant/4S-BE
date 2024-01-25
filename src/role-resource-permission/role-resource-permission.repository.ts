import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { RoleResourcePermission } from "./entity/role-resource-permission.entity";

export class RoleResourcePermissionRepository extends Repository<RoleResourcePermission> {
  public getPermissionByRoleAndResourceId(roleId: string, resourceId: string): SelectQueryBuilder<RoleResourcePermission> {
    return getManager().getRepository(RoleResourcePermission).createQueryBuilder("roleResourcePermission").where("roleResourcePermission.role = :roleId AND roleResourcePermission.resource = :resourceId", { roleId, resourceId });
  }
  public getRoleResourcePermissionById(roleId: string): SelectQueryBuilder<RoleResourcePermission> {
    return getManager()
      .getRepository(RoleResourcePermission)
      .createQueryBuilder("roleResourcePermission")
      .leftJoinAndSelect("roleResourcePermission.role", "role")
      .leftJoinAndSelect("roleResourcePermission.resource", "resource")
      .where("roleResourcePermission.role = :roleId", { roleId });
  }
}
