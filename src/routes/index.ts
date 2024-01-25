import { Router } from "express";

import dataModelRoutes from "../data-models/data-models.routes";
import userRoutes from "../user/user.routes";
import siteRoutes from "../site/site.routes";
import roleResourcePermissionRoutes from "../role-resource-permission/role-resource-permission.routes";
import roleRoutes from "../role/role.routes";
import sensorRoutes from "../sensor/sensor.routes";
import areaRoutes from "../area/area.routes";
import alertRuleRoutes from "../alert-rule/alert-rule.routes";
import personnelRoutes from "../personnel/personnel.routes";
import alertRoutes from "../alert/alert.routes";
import assetRoutes from "../asset/asset.routes";
import assetSensorRoutes from "../asset-sensor/asset-sensor.routes";
import resourceRoutes from "../resource/resource.routes";
import UserProfileRoutes from "../user-profile/user-profile.routes";
import wirepas from "../wirepas/wirepas.routes";

const router = Router();

router.get("/", (_, res) => res.send("Welcome to the server"));
router.use("/data-models", dataModelRoutes);
router.use("/user", userRoutes);
router.use("/site", siteRoutes);
router.use("/role-resource-permission", roleResourcePermissionRoutes);
router.use("/role", roleRoutes);
router.use("/sensor", sensorRoutes);
router.use("/area", areaRoutes);
router.use("/alert", alertRoutes);
router.use("/alert-rule", alertRuleRoutes);
router.use("/personnel", personnelRoutes);
router.use("/asset", assetRoutes);
router.use("/asset-sensor", assetSensorRoutes);
router.use("/resource", resourceRoutes);
router.use("/user-profile", UserProfileRoutes);
router.use("/wirepas", wirepas);

export default router;
