import express from "express";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { WirepasBuildingController } from "./wirepas-building.controller";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { WirepasBuildingDtos } from "./dto/building.dto";
import { WirepasFloorlevelController } from "./wirepas-floorlevel.controller";
import { WirepasFloorlevelDtos } from "./dto/wirepas-floorlevel.dto";
import uploadFilesMiddleware from "../middleware/multar.uploader";
import { WirepasSensorController } from "./wirepas-sensor.controller";
import { WirepasSensorDto } from "./dto/wirepas-sensor.dto";

const wirepasBuildingController = new WirepasBuildingController();
const wirepasFloorlevelController = new WirepasFloorlevelController();
const wirepasSensorController = new WirepasSensorController();
const router = express.Router();

router.post("/buildings", authentication(RESOURCES_TYPES.BUILDING, PERMISSIONS_TYPES.READ), wirepasBuildingController.getWirepasBuildingsWithFloorLevels);
router.get("/building/:buildingId", authentication(RESOURCES_TYPES.BUILDING, PERMISSIONS_TYPES.READ), wirepasBuildingController.getWirepasBuildingWithFloorLevel);
router.post("/building", authentication(RESOURCES_TYPES.BUILDING, PERMISSIONS_TYPES.WRITE), validationMiddleware(WirepasBuildingDtos.CreateDto), wirepasBuildingController.createWirepasBuilding);
router.post("/floorlevel", authentication(RESOURCES_TYPES.FLOORLEVEL, PERMISSIONS_TYPES.WRITE), validationMiddleware(WirepasFloorlevelDtos.CreateWirepasFloorlevelDto), wirepasFloorlevelController.createWirepasFloorlevel);
router.get("/floorlevel/:floorlevelId", authentication(RESOURCES_TYPES.FLOORLEVEL, PERMISSIONS_TYPES.READ), wirepasFloorlevelController.getWirepasFloorlevel);
router.post("/floorlevel/:buildingId", authentication(RESOURCES_TYPES.FLOORLEVEL, PERMISSIONS_TYPES.READ), validationMiddleware(WirepasFloorlevelDtos.GetFloorlevelDto), wirepasFloorlevelController.getWirepasFloorlevelByBuilding);
router.post("/sensor/:floorlevelId", authentication(RESOURCES_TYPES.SENSOR, PERMISSIONS_TYPES.READ), validationMiddleware(WirepasSensorDto.GetWirepasSensor), wirepasSensorController.getWirepasSensorByFloorlevelId);

router.put("/floorlevel/:floorlevelId", authentication(RESOURCES_TYPES.FLOORLEVEL, PERMISSIONS_TYPES.UPDATE), validationMiddleware(WirepasFloorlevelDtos.UpdateWirepasFloorlevelDto), wirepasFloorlevelController.updateWirepasFloorlevel);
router.put("/building/:buildingId", authentication(RESOURCES_TYPES.BUILDING, PERMISSIONS_TYPES.UPDATE), validationMiddleware(WirepasBuildingDtos.UpdateWirepasBuildingDto), wirepasBuildingController.updateWirepasBuilding);
router.put("/floorlevel-image/:floorlevelId", authentication(RESOURCES_TYPES.FLOORLEVEL, PERMISSIONS_TYPES.UPDATE), uploadFilesMiddleware, wirepasFloorlevelController.uploadWirepasFloorlevelImage);

router.delete("/building/:buildingId", authentication(RESOURCES_TYPES.BUILDING, PERMISSIONS_TYPES.DELETE), wirepasBuildingController.deleteWirepasBuilding);
router.delete("/floorlevel/:floorlevelId", authentication(RESOURCES_TYPES.FLOORLEVEL, PERMISSIONS_TYPES.DELETE), wirepasFloorlevelController.deleteWirepasFloorlevel);

export default router;
