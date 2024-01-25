import { UserRole } from "../../user-role/entity/user-role.entity";
import { User } from "../entity/user.entity";

export interface ResourcePermission {
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canWrite: boolean;
  siteId: string;
}

export interface AccessRightsInterface {
  [resourceName: string]: ResourcePermission;
}

export const extractAccessRightsFromRoles = (user: User): AccessRightsInterface => {
  let accessRights: AccessRightsInterface = {};

  user.userRole.forEach((userRole: UserRole) => {
    userRole.role.roleResourcePermission.forEach((resourcePermission) => {
      accessRights = {
        ...accessRights,
        [resourcePermission.resource.name]: {
          canRead: resourcePermission.canRead,
          canUpdate: resourcePermission.canUpdate,
          canDelete: resourcePermission.canDelete,
          canWrite: resourcePermission.canWrite,
          siteId: userRole.site.id,
        },
      };
    });
  });

  return accessRights;
};
