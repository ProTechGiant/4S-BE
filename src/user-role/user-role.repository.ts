import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { UserRole } from "./entity/user-role.entity";

export class UserRoleRepository extends Repository<UserRole> {
  public getUserRoleWithResourceByIdz(idz: string[]): SelectQueryBuilder<UserRole> {
    return getManager()
      .getRepository(UserRole)
      .createQueryBuilder("userRole")
      .leftJoinAndSelect("userRole.role", "role")
      .leftJoinAndSelect("userRole.site", "site")
      .leftJoinAndSelect("role.roleResourcePermission", "roleResourcePermission")
      .leftJoinAndSelect("roleResourcePermission.resource", "resource")
      .where("userRole.id IN (:...idz)", { idz });
  }

  public getUserRolesByUserAndRoleIdz(roleIdz: string[], userId: string): SelectQueryBuilder<UserRole> {
    return getManager().getRepository(UserRole).createQueryBuilder("userRole").leftJoin("userRole.role", "role").leftJoin("userRole.user", "user").where("user.id = :userId AND role.id IN (:...roleIdz)", { roleIdz, userId });
  }

  public getUserRolesByUserId(userId: string): SelectQueryBuilder<UserRole> {
    return getManager().getRepository(UserRole).createQueryBuilder("userRole").leftJoinAndSelect("userRole.user", "user").where("user.id = :userId ", { userId });
  }
}
