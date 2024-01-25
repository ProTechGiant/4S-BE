import { validationMiddleware } from "../errors/middleware/validation.middleware";
import express from "express";
import { RoleResourcePermissionController } from "./role-resource-permission.controller";
import { RoleResourcePermissionDtos } from "./dto/role-resource-permission.dto";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";

const router = express.Router();

const roleResourcePermissionController = new RoleResourcePermissionController();

router.put(
  "/",
  authentication(RESOURCES_TYPES.ROLE, PERMISSIONS_TYPES.UPDATE, RESOURCES_TYPES.RESOURCE),

  validationMiddleware(RoleResourcePermissionDtos.UpdateRoleResourcePermissionDto),
  roleResourcePermissionController.updateRoleResourcePermission
);
router.delete("/:roleId", authentication(RESOURCES_TYPES.ROLE, PERMISSIONS_TYPES.UPDATE), roleResourcePermissionController.deleteRoleResourcePermission);
router.get("/resource-name", authentication(null, PERMISSIONS_TYPES.READ), roleResourcePermissionController.getRoleResourcePermission);

export default router;
