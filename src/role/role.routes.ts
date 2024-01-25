import { validationMiddleware } from "../errors/middleware/validation.middleware";
import express from "express";
import { RoleController } from "./role.controller";
import { RoleDtos } from "./dto/role.dto";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";

const router = express.Router();

const roleController = new RoleController();

router.post(
    "/",
    authentication(RESOURCES_TYPES.ROLE, PERMISSIONS_TYPES.WRITE),
    validationMiddleware(RoleDtos.CreateRoleDto),
    roleController.createRole
);
router.put("/:roleId", authentication(RESOURCES_TYPES.ROLE, PERMISSIONS_TYPES.UPDATE), roleController.updateRole);
router.delete("/:roleId", authentication(RESOURCES_TYPES.ROLE, PERMISSIONS_TYPES.DELETE), roleController.deleteRole);

export default router;
