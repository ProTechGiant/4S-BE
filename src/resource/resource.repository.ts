import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { Resource } from "./entity/resource.entity";
import { RoleTypes } from "../common/enums";

export class ResourceRepository extends Repository<Resource> {
  public getResourceByName(name: string): SelectQueryBuilder<Resource> {
    return getManager().getRepository(Resource).createQueryBuilder("resource").where("resource.name = :name", { name });
  }

  public getAllResources(): SelectQueryBuilder<Resource> {
    return getManager().getRepository(Resource).createQueryBuilder("resource");
  }

  public getResourceByNamesAndType(names: string[]): SelectQueryBuilder<Resource> {
    return getManager().getRepository(Resource).createQueryBuilder("resource").where("resource.name IN (:...names)", { names });
  }

  public getResourcesByIdz(idz: string[]): SelectQueryBuilder<Resource> {
    return getManager().getRepository(Resource).createQueryBuilder("resource").where("resource.id IN (:...idz)", { idz });
  }

  public getUserResources(id: string): SelectQueryBuilder<Resource> {
    return getManager()
      .getRepository(Resource)
      .createQueryBuilder("resource")
      .leftJoinAndSelect("resource.roleResourcePermission", "roleResourcePermission")
      .leftJoinAndSelect("roleResourcePermission.role", "role")
      .leftJoinAndSelect("role.userRole", "userRole")
      .leftJoinAndSelect("userRole.user", "user")
      .select(["resource.name"])
      .where("user.id = :id", { id })
      .andWhere("(roleResourcePermission.canRead = :canRead OR roleResourcePermission.canWrite = :canWrite OR roleResourcePermission.canUpdate = :canUpdate OR roleResourcePermission.canDelete = :canDelete)", {
        canRead: true,
        canWrite: true,
        canUpdate: true,
        canDelete: true,
      });
  }

  public getResourcesByRoleIdz(roleIdz: string[]): SelectQueryBuilder<Resource> {
    return getManager()
      .getRepository(Resource)
      .createQueryBuilder("resource")
      .leftJoinAndSelect("resource.roleResourcePermission", "roleResourcePermission")
      .leftJoinAndSelect("roleResourcePermission.role", "role")
      .select(["resource.name"])
      .where("role.id IN (:...roleIdz)", { roleIdz })
      .andWhere("(roleResourcePermission.canRead = :canRead OR roleResourcePermission.canWrite = :canWrite OR roleResourcePermission.canUpdate = :canUpdate OR roleResourcePermission.canDelete = :canDelete)", {
        canRead: true,
        canWrite: true,
        canUpdate: true,
        canDelete: true,
      });
  }
}
