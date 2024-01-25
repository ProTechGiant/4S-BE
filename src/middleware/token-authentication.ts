import { BadGatewayException, UnauthorizedException } from "../errors/exceptions";
import { NextFunction, RequestHandler, Response } from "express";
import { tokenDecoder } from "../common/utils/assign-and-decode-token";
import { UserService } from "../user/user.service";
import { CommonDTOs } from "../common/dto";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { RoleResourcePermissionService } from "../role-resource-permission/role-resource-permission.service";

const userService = new UserService();
const roleResourcePermissionService = new RoleResourcePermissionService();
export const authentication = (resource?: RESOURCES_TYPES, permission?: PERMISSIONS_TYPES, resource2?: RESOURCES_TYPES): RequestHandler => {
  return async (req: RequestTypes, res: Response, next: NextFunction) => {
    const entityName = req.body.entity as RESOURCES_TYPES;
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new UnauthorizedException("Invalid authorization specified");

      const decodedUser = tokenDecoder(token);
      if (!decodedUser) throw new UnauthorizedException("Invalid authorization specified");

      const user = await checkAndGetCurrentUser(decodedUser.email);
      req.currentUser = user;

      if (decodedUser.isSuperAdmin) return next();

      if (entityName && permission) {
        await checkPermission(user.id, entityName, permission, req.body.siteId);
      }
      if (resource && permission) {
        await checkPermission(user.id, resource, permission, req.body.siteId, resource2);
      }

      return next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

const checkAndGetCurrentUser = async (email: string): Promise<CommonDTOs.CurrentUser> => {
  const user = await userService.getUserByEmail(email);
  if (!user) throw new UnauthorizedException("Invalid authorization specified");
  const currentUser: CommonDTOs.CurrentUser = {
    isSuperAdmin: user.isSuperAdmin,
    email: user.email,
    id: user.id,
    name: user.firstName + " " + user.lastName,
    password: user.password,
  };
  return currentUser;
};

const checkPermission = async (userId: string, resource: RESOURCES_TYPES, permission: PERMISSIONS_TYPES, siteId?: string, resource2?: RESOURCES_TYPES): Promise<void> => {
  const hasPermission = await roleResourcePermissionService.hasPermissionForResource(userId, resource, permission, siteId, resource2);
  if (!hasPermission) throw new BadGatewayException("Access denied for resource");
};
