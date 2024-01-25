import { BaseService } from "../base/base.service";
import { RoleDtos } from "./dto/role.dto";

import { Role } from "./entity/role.entity";
import { RoleRepository } from "./role.repository";
import { RoleResourcePermission } from "../role-resource-permission/entity/role-resource-permission.entity";
import { ResourceService } from "../resource/resource.service";
import { NoRecordFoundException } from "../errors/exceptions";
import { CommonDTOs } from "../common/dto";

export class RoleService extends BaseService {
  private readonly roleRepository: RoleRepository;
  private readonly resourceService: ResourceService;
  constructor() {
    super();
    this.roleRepository = new RoleRepository();
    this.resourceService = new ResourceService();
  }

  async getRoleById(id: string): Promise<Role> {
    try {
      return this.roleRepository.getRoleById(id).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findRolesByIdz(idz: string[]): Promise<Role[]> {
    try {
      return this.roleRepository.getRolesByIdz(idz).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async createRole(input: RoleDtos.CreateRoleDto): Promise<Role> {
    try {
      const role = new Role();
      const transactionScope = this.getTransactionScope();
      role.name = input.name;
      const roleResourcePermissions = await this.assignResourcesToRole(role, input.resources);

      transactionScope.add(role);
      transactionScope.addCollection(roleResourcePermissions);
      await transactionScope.commit();
      return role;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateRole(input: RoleDtos.UpdateRoleDto, roleId: string): Promise<Role> {
    try {
      const transactionScope = this.getTransactionScope();

      const role = await this.getRoleById(roleId);
      if (!role) throw new NoRecordFoundException("Invalid role specified");
      if (input.name) role.name = input.name;
      transactionScope.update(role);
      transactionScope.commit();
      return role;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteRole(roleId: string): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = this.getTransactionScope();

      const role = await this.roleRepository.getRoleByIdWithRoleResource(roleId).getOne();
      if (!role) throw new NoRecordFoundException("Invalid role specified");
      transactionScope.delete(role);
      transactionScope.hardDeleteCollection(role.roleResourcePermission);
      transactionScope.hardDeleteCollection(role.userRole);
      await transactionScope.commit();
      return { message: `Role deleted` };
    } catch (error) {
      throw new Error(error);
    }
  }

  async assignResourcesToRole(role: Role, input: Partial<RoleDtos.ResourcesPermissionDto[]>): Promise<RoleResourcePermission[]> {
    let roleResourcePermissions: RoleResourcePermission[] = [];
    const resourcesIdz = input.map(({ resourceId }) => resourceId);
    const resources = await this.resourceService.getResourcesByIdz(resourcesIdz);
    if (!resources.length) throw new Error("Invalid resources specified");

    const mappedResources = resources.map((resource) => {
      const item = input.find((item) => item.resourceId === resource.id);
      return { resource, ...item };
    });

    mappedResources.forEach((resource) => {
      const roleResourcePermission = new RoleResourcePermission();
      roleResourcePermission.role = role;
      roleResourcePermission.canDelete = resource.canDelete;
      roleResourcePermission.canRead = resource.canRead;
      roleResourcePermission.canUpdate = resource.canUpdate;
      roleResourcePermission.canWrite = resource.canWrite;
      roleResourcePermission.resource = resource.resource;
      roleResourcePermissions.push(roleResourcePermission);
    });
    return roleResourcePermissions;
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      return this.roleRepository.getAllRoles().getMany();
    } catch (error) {
      throw new Error(error);
    }
  }
}
