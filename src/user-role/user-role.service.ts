import { BaseService } from "../base/base.service";
import { User } from "../user/entity/user.entity";
import { UserRole } from "./entity/user-role.entity";
import { SiteService } from "../site/site.service";
import { RoleService } from "../role/role.service";
import { RoleTypes } from "../common/enums";
import { NoRecordFoundException } from "../errors/exceptions";
import { UserRoleRepository } from "./user-role.repository";
import { TransactionScope } from "../base/transactionScope";

export class UserRoleService extends BaseService {
  private readonly roleService: RoleService;
  private readonly siteServide: SiteService;
  private readonly userRoleRepository: UserRoleRepository;
  constructor() {
    super();
    this.siteServide = new SiteService();
    this.roleService = new RoleService();
    this.userRoleRepository = new UserRoleRepository();
  }

  async assignRolesToUser(roleIdz: string[], user: User, siteId: string, transactionScope?: TransactionScope): Promise<UserRole[]> {
    try {
      let userRoles: UserRole[] = [];
      const roles = await this.roleService.findRolesByIdz(roleIdz);
      if (!roles.length) throw new NoRecordFoundException("Invalid roles specified");

      const site = await this.siteServide.getSiteById(siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");

      roles.forEach((role) => {
        const userRole = new UserRole();
        userRole.role = role;
        userRole.user = user;
        userRole.site = site;
        userRoles.push(userRole);
      });
      if (transactionScope) {
        transactionScope.addCollection(userRoles);
      }
      return userRoles;
    } catch (error) {
      throw new Error(error);
    }
  }

  async reAssignRolesToUser(roleIdz: string[], user: User, siteId: string, transactionScope?: TransactionScope): Promise<UserRole[]> {
    try {
      const previousUserRoles = await this.userRoleRepository.getUserRolesByUserAndRoleIdz(roleIdz, user.id).getMany();
      const userRole = await this.assignRolesToUser(roleIdz, user, siteId, transactionScope);
      if (transactionScope) {
        transactionScope.deleteCollection(previousUserRoles);
      }
      return userRole;
    } catch (error) {
      throw new Error(error);
    }
  }

  async changeSite(siteId: string, userId: string): Promise<UserRole[]> {
    try {
      let updatedUserRoles: UserRole[] = [];
      let userRole = await this.userRoleRepository.getUserRolesByUserId(userId).getMany();
      const site = await this.siteServide.getSiteById(siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");

      userRole.forEach((userRole) => {
        userRole.site = site;
        updatedUserRoles.push(userRole);
      });

      return updatedUserRoles;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserRoleWithResourceByIdz(idz: string[]): Promise<UserRole[]> {
    try {
      return this.userRoleRepository.getUserRoleWithResourceByIdz(idz).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }
}
