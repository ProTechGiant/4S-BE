import express from "express";

import { PersonnelDtos } from "./dto/personnel.dto";
import { PersonnelController } from "./personnel.controller";
import { validationMiddleware } from "../errors/middleware/validation.middleware";

const router = express.Router();

// create instance
const personnelController = new PersonnelController();

// Routes

router.post(
  "/",
  validationMiddleware(PersonnelDtos.CreatePersonnelDto),

  personnelController.createPersonnel
);
router.put(
  "/:personnelId",
  validationMiddleware(PersonnelDtos.UpdatePersonnelDto),

  personnelController.updatePersonnel
);

export default router;
