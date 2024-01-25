import { EntityManager, Repository, SelectQueryBuilder, getManager } from "typeorm";

import { User } from "./entity/user.entity";
import { TransformQueryByFilter } from "../common/utils/json-to-object";
import { UserDtos } from "./dto/user.dto";

export class UserRepository extends Repository<User> {
  public getUserByEmail(email: string): SelectQueryBuilder<User> {
    return getManager().getRepository(User).createQueryBuilder("user").where("email = :email", { email });
  }
  public getUserByPhoneNumber(phoneNumber: string): SelectQueryBuilder<User> {
    return getManager().getRepository(User).createQueryBuilder("user").where({ phoneNumber });
  }

  public getUserByIdWithRole(id: string): SelectQueryBuilder<User> {
    return getManager().getRepository(User).createQueryBuilder("user").where("user.id = :id", { id }).leftJoinAndSelect("user.userRole", "userRole");
  }

  public async getUserByIdWithRoleAndRights(id: string): Promise<UserDtos.GetUserByIdWithRoleAndRightsOutput[]> {
    const entityManager: EntityManager = getManager();

    const query = `
    SELECT
        role_resource_permission.can_read AS canRead ,
        role_resource_permission.can_update AS canUpdate,
        role_resource_permission.can_delete As canDelete,
        role_resource_permission.can_write As canWrite,
        resource.id AS resourceId,
        resource.name AS resourceName
    FROM
      "user"
        LEFT JOIN user_role ON user_role.user_id = "user".id
        LEFT JOIN role ON role.id = user_role.role_id
        LEFT JOIN role_resource_permission ON role_resource_permission.role_id = role.id
        LEFT JOIN resource ON resource.id = role_resource_permission.resource_id
    WHERE
        "user".id = '${id}'`;

    const result = await entityManager.query(query);

    return result;
  }

  public getUserById(id: string): SelectQueryBuilder<User> {
    return getManager().getRepository(User).createQueryBuilder("user").where("user.id = :id", { id });
  }
  public getUserByIdAndUserRole(id: string): SelectQueryBuilder<User> {
    return getManager().getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.userRole", "userRole").where("user.id = :id", { id });
  }

  public getAllUsers(filter: any, input: UserDtos.GetAllUsersDto): SelectQueryBuilder<User> {
    const query = getManager().getRepository(User).createQueryBuilder("user").select(["user.id", "user.email", "user.firstName", "user.lastName"]).leftJoinAndSelect("user.userRole", "userRole").leftJoinAndSelect("userRole.role", "role");
    return TransformQueryByFilter<User>(filter, query).limit(input.limit).offset(input.offset);
  }

  public findTemporaryDeleteUsersByEmail(email: string): SelectQueryBuilder<User> {
    return getManager().getRepository(User).createQueryBuilder("user").where("email = :email", { email }).withDeleted();
  }

  public getUserByEmailWithResourcesPermission(email: string): SelectQueryBuilder<User> {
    return getManager()
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userRole", "userRole")
      .leftJoinAndSelect("userRole.site", "site")
      .leftJoinAndSelect("userRole.role", "role")
      .leftJoinAndSelect("role.roleResourcePermission", "roleResourcePermission")
      .leftJoinAndSelect("roleResourcePermission.resource", "resource")
      .where("user.email = :email", { email });
  }
}
