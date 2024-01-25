import express from "express";

import { validationMiddleware } from "../errors/middleware/validation.middleware";

import { UserController } from "./user-profile.controller";
import { authentication } from "../middleware/token-authentication";
import { UserProfileDtos } from "./dto/user-profile.dto";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";

const router = express.Router();

// create instance
const userController = new UserController();

// Routes
router.put("/", authentication(), validationMiddleware(UserProfileDtos.UpdateUserProfileDto), userController.updateProfileUser);

router.get("/", authentication(), userController.getUserProfile);

export default router;
