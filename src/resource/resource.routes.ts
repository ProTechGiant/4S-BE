import express from "express";
import { ResourceController } from "./resource.controller";
import { authentication } from "../middleware/token-authentication";

const router = express.Router();

// create instance
const resourceController = new ResourceController();

router.get("/", authentication(), resourceController.getUserResource);
router.get("/get-with-column-names", authentication(), resourceController.getUserResourceWithColumnNames);
export default router;
