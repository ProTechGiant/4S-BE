import { NextFunction, Request, Response } from "express";
import { RoleResourcePermission } from "./entity/role-resource-permission.entity";
import { RoleResourcePermissionService } from "./role-resource-permission.service";

export class RoleResourcePermissionController {
  private readonly roleResourcePermissionService: RoleResourcePermissionService;
  constructor() {
    this.roleResourcePermissionService = new RoleResourcePermissionService();
  }

  updateRoleResourcePermission = async (req: Request, res: Response): Promise<void> => {
    const input = req.body;

    try {
      const result = await this.roleResourcePermissionService.updateResourceToRole(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  deleteRoleResourcePermission = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;

    try {
      const result = await this.roleResourcePermissionService.deleteRoleResourcePermission(roleId);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  getRoleResourcePermission = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];

    try {
      const result = await this.roleResourcePermissionService.getRoleResourcePermission(token);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
}
