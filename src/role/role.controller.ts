import { NextFunction, Request, Response } from "express";
import { RoleService } from "./role.service";

export class RoleController {
  private readonly roleService: RoleService;
  constructor() {
    this.roleService = new RoleService();
  }

  createRole = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.roleService.createRole(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  deleteRole = async (req: RequestTypes, res: Response): Promise<void> => {
    const { roleId } = req.params;
    try {
      const result = await this.roleService.deleteRole(roleId);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  updateRole = async (req: RequestTypes, res: Response): Promise<void> => {
    const { roleId } = req.params;
    const input = req.body;
    try {
      const result = await this.roleService.updateRole(input, roleId);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
}
