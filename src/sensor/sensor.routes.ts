import express from "express";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { SensorController } from "./sensor.controller";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { SensorDto } from "./dto/sensor.dto";
import wirepasRoutes from "../wirepas/wirepas.routes";
import uploadFilesMiddleware from "../middleware/multar.uploader";

const sensorController = new SensorController();
const router = express.Router();

router.post("/unlink_sensor", authentication(RESOURCES_TYPES.SENSOR, PERMISSIONS_TYPES.READ), validationMiddleware(SensorDto.GetSensorWithSiteDto), sensorController.getUnlinkSensors); //uncomplete
router.post("/", authentication(RESOURCES_TYPES.SENSOR, PERMISSIONS_TYPES.WRITE), validationMiddleware(SensorDto.GetSensorDto), sensorController.getSensors);
router.delete("/:id", authentication(RESOURCES_TYPES.SENSOR, PERMISSIONS_TYPES.DELETE), validationMiddleware(SensorDto.DeleteSensorDto), sensorController.deleteSensor);

router.post("/upload-sensor-data", authentication(RESOURCES_TYPES.NARROWBAND_SENSORS, PERMISSIONS_TYPES.WRITE), sensorController.uploadSensorData);
router.post("/bulk-import/:protocol", authentication(RESOURCES_TYPES.SENSOR, PERMISSIONS_TYPES.WRITE), uploadFilesMiddleware, sensorController.bulkImportSensors);

router.use("/wirepas", wirepasRoutes);
export default router;
