import { BaseService } from "../base/base.service";
import { RoleResourcePermission } from "./entity/role-resource-permission.entity";
import { NoRecordFoundException, UnauthorizedException } from "../errors/exceptions";
import { ResourceService } from "../resource/resource.service";
import { RoleResourcePermissionRepository } from "./role-resource-permission.repository";
import { RoleService } from "../role/role.service";
import { RoleResourcePermissionDtos } from "./dto/role-resource-permission.dto";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { UserService } from "../user/user.service";
import { UserRoleService } from "../user-role/user-role.service";
import { Role } from "../role/entity/role.entity";
import { tokenDecoder } from "../common/utils/assign-and-decode-token";

export class RoleResourcePermissionService extends BaseService {
  private readonly roleService: RoleService;
  private readonly roleResourcePermissionRepository: RoleResourcePermissionRepository;
  private readonly userRoleService: UserRoleService;
  private readonly resourceService: ResourceService;
  private readonly userService: UserService;

  constructor() {
    super();
    this.roleService = new RoleService();
    this.resourceService = new ResourceService();
    this.roleResourcePermissionRepository = new RoleResourcePermissionRepository();
    this.userService = new UserService();
    this.userRoleService = new UserRoleService();
  }

  async updateResourceToRole(input: RoleResourcePermissionDtos.UpdateRoleResourcePermissionDto): Promise<RoleResourcePermission[] | void> {
    try {
      const { roleId } = input;
      const transactionScope = this.getTransactionScope();
      const role = await this.roleService.getRoleById(roleId);
      if (!role) throw new NoRecordFoundException("Invalid role specified");

      const roleResourcePermissions = await this.roleResourcePermissionRepository.getRoleResourcePermissionById(roleId).getMany();
      const roleResourcePermissionsIds = roleResourcePermissions.map((roleResourcePermission: RoleResourcePermission) => roleResourcePermission.resource.name);
      const roleResourcePermissionDelete = [];
      const roleResourcePermissionUpdate = [];
      const roleResourcePermissionCreate = [];
      for (const roleResourceInput of input.resource) {
        if (roleResourcePermissionsIds.includes(roleResourceInput.resourceName)) {
          const roleResourcePermissionsIndex = roleResourcePermissions.findIndex((roleResourcePermission) => roleResourcePermission.resource.name === roleResourceInput.resourceName);
          const roleResourcePermissionData = roleResourcePermissions[roleResourcePermissionsIndex];
          roleResourcePermissionData.canRead = !!roleResourceInput.canRead;
          roleResourcePermissionData.canDelete = !!roleResourceInput.canDelete;
          roleResourcePermissionData.canUpdate = !!roleResourceInput.canDelete;
          roleResourcePermissionData.canWrite = !!roleResourceInput.canWrite;
          roleResourcePermissionUpdate.push(roleResourcePermissionData);
        } else {
          const createRoleResource = await this.assignResourceToRole(roleResourceInput, role);
          roleResourcePermissionCreate.push(createRoleResource);
        }
      }

      if (roleResourcePermissionUpdate.length !== roleResourcePermissions.length) {
        roleResourcePermissionDelete.push(...roleResourcePermissions.filter((roleResourcePermission) => input.resource.every((res) => roleResourcePermission.resource.name !== res.resourceName)));
      }

      if (roleResourcePermissionCreate.length) {
        transactionScope.addCollection(roleResourcePermissionCreate);
      }

      if (roleResourcePermissionUpdate.length) {
        transactionScope.updateCollection(roleResourcePermissionUpdate);
      }

      if (roleResourcePermissionDelete.length) {
        transactionScope.hardDeleteCollection(roleResourcePermissionDelete);
      }

      await transactionScope.commit();
      return [...roleResourcePermissionUpdate, ...roleResourcePermissionCreate];
    } catch (error) {
      throw new Error(error);
    }
  }
  async assignResourceToRole(input: RoleResourcePermissionDtos.ResourcePermissionDto, role: Role): Promise<RoleResourcePermission> {
    try {
      const resource = await this.resourceService.getResourceByName(input.resourceName);
      if (!resource) throw new NoRecordFoundException("Invalid resource specified");
      const roleResourcePermission = new RoleResourcePermission();
      roleResourcePermission.resource = resource;
      roleResourcePermission.role = role;
      roleResourcePermission.canRead = !!input.canRead;
      roleResourcePermission.canDelete = !!input.canDelete;
      roleResourcePermission.canUpdate = !!input.canUpdate;
      roleResourcePermission.canWrite = !!input.canWrite;
      return roleResourcePermission;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteRoleResourcePermission(roleId: string): Promise<RoleResourcePermission[]> {
    try {
      const roleResourcePermission = await this.roleResourcePermissionRepository.getRoleResourcePermissionById(roleId).getMany();
      const transactionScope = this.getTransactionScope();

      if (roleResourcePermission) {
        transactionScope.deleteCollection(roleResourcePermission);
        await transactionScope.commit();
      }

      return roleResourcePermission;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getRoleResourcePermission(token: string): Promise<RoleResourcePermission[] | unknown[] | any> {
    try {
      if (!token) throw new UnauthorizedException("Invalid authorization specified");

      const decodedUser = tokenDecoder(token);
      if (!decodedUser) throw new UnauthorizedException("Invalid authorization specified");
      const user = await this.userService.getUserByEmail(decodedUser.email);
      const userWithRole = await this.userService.getUserByIdWithRoleAndRights(user.id);

      if (!user.isSuperAdmin) {
        const roleResourcePermission = {};
        for (const role of userWithRole) {
          if (roleResourcePermission[role.resourcename] === undefined) {
            roleResourcePermission[role.resourcename] = role;
          } else {
            roleResourcePermission[role.resourcename] = {
              canread: roleResourcePermission[role.resourcename].canread || role.canread,
              canupdate: roleResourcePermission[role.resourcename].canupdate || role.canupdate,
              candelete: roleResourcePermission[role.resourcename].candelete || role.candelete,
              canwrite: roleResourcePermission[role.resourcename].canwrite || role.canwrite,
              resourceid: role.resourceid,
              resourcename: role.resourcename,
            };
          }
        }
        console.log(roleResourcePermission);
        return roleResourcePermission;
      }

      return "*";
    } catch (error) {
      throw new Error(error);
    }
  }

  async hasPermissionForResource(userId: string, resource: RESOURCES_TYPES, permission: PERMISSIONS_TYPES, siteId: string): Promise<boolean> {
    try {
      const user = await this.userService.getUserByIdWithRole(userId);
      const userRoleIdz = user.userRole.map((uRole) => uRole.id);
      const userRole = await this.userRoleService.getUserRoleWithResourceByIdz(userRoleIdz);

      const hasPermission = userRole.some((uRole) => {
        const permissions = uRole.role.roleResourcePermission.some((resoursePermission) => resoursePermission.resource.name === resource && resoursePermission[permission]);

        if (!siteId) {
          return permissions;
        } else {
          return uRole.site.id === siteId;
        }
      });

      return hasPermission;
    } catch (error) {
      throw new Error(error);
    }
  }
}
