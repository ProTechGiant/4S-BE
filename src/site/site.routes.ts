import { validationMiddleware } from "../errors/middleware/validation.middleware";
import express from "express";
import { SiteController } from "./site.controller";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES } from "../common/enums";
import { SiteDtos } from "./dto/site.dto";

const router = express.Router();

const siteController = new SiteController();
router.post("/", authentication(null, PERMISSIONS_TYPES.WRITE), validationMiddleware(SiteDtos.CreateSiteInput), siteController.createSite);
router.get("/:siteId", authentication(null, PERMISSIONS_TYPES.READ), siteController.getSiteById);
router.get("/", authentication(null, PERMISSIONS_TYPES.READ), siteController.getAllSites);
router.put("/:siteId", authentication(null, PERMISSIONS_TYPES.UPDATE), validationMiddleware(SiteDtos.UpdateSiteInput), siteController.updateSite);
router.delete("/:siteId", authentication(null, PERMISSIONS_TYPES.DELETE), siteController.deleteSite);

export default router;
