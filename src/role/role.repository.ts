import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { Role } from "./entity/role.entity";
import { RoleTypes } from "../common/enums";

export class RoleRepository extends Repository<Role> {
  public getRoleById(id: string): SelectQueryBuilder<Role> {
    return getManager().getRepository(Role).createQueryBuilder("role").where("role.id = :id", { id });
  }
  public getRoleByIdWithRoleResource(id: string): SelectQueryBuilder<Role> {
    return getManager().getRepository(Role).createQueryBuilder("role").leftJoinAndSelect("role.roleResourcePermission", "roleResourcePermission").leftJoinAndSelect("role.userRole", "userRole").where("role.id = :id", { id });
  }

  public getAllRoles(): SelectQueryBuilder<Role> {
    return getManager().getRepository(Role).createQueryBuilder("role");
  }

  public getRolesByIdz(idz: string[]): SelectQueryBuilder<Role> {
    return getManager().getRepository(Role).createQueryBuilder("role").leftJoinAndSelect("role.roleResourcePermission", "roleResourcePermission").leftJoinAndSelect("roleResourcePermission.resource", "resource").where("role.id IN (:...idz)", { idz });
  }
}
