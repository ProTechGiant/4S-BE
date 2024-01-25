import express from "express";
import { AssetSenosrController } from "./asset-sensor.controller";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { AssetSensorDtos } from "./dto/asset-sensor.dto";

const router = express.Router();
const assetSensorController = new AssetSenosrController();

router.put(
  "/:assetSensorId",
  /* #swagger.tags = ['Asset']
   #swagger.description = 'Update Asset'
   #swagger.parameters['AssetIdParam'] = {
       in: 'path',
       required: true,
        name: 'assetId',
       type: 'integer',
       description: 'ID of the asset to update.'
   }
   #swagger.parameters['UpdateAssetParams'] = {
       in: 'body',
       required: true,
       schema: {
        "assetId":"",
    "sensorId":""
       }
   }
     
*/
  authentication(RESOURCES_TYPES.ASSET_SENSOR, PERMISSIONS_TYPES.UPDATE),

  assetSensorController.updateAssetSensor
);

router.post(
  "/",
  /* #swagger.tags = ['AssetSensor']
   #swagger.description = 'Create AssetSensor'
   #swagger.parameters['CreateAssetSensorParams'] = {
       in: 'body',
       required: true,
       schema: 
       {
        "assetId":"",
    "sensorId":""
       }
   } 
*/
  authentication(RESOURCES_TYPES.ASSET_SENSOR, PERMISSIONS_TYPES.UPDATE),

  assetSensorController.createAssetSensor
);

router.delete(
  "/",
  /* #swagger.tags = ['AssetSensor']
   #swagger.description = 'Delete AssetSensor'
    #swagger.parameters['AssetSensorIdParam'] = {
       in: 'body',
       required: true,
       schema: 
       {
        "assetId":"",
        "sensorId":"",
    
       }
   } 
     
   */
  authentication(RESOURCES_TYPES.ASSET_SENSOR, PERMISSIONS_TYPES.DELETE),

  assetSensorController.deleteAssetSensor
);

router.post(
  "/link",
  /* #swagger.tags = ['AssetSensor']
   #swagger.description = 'Link AssetSensor'
    #swagger.parameters['AssetSensorIdParam'] = {
       in: 'body',
       required: true,
       schema: 
       {
        "assetId":"",
        "sensorId":"",
    
       }
   } 
     
   */

  authentication(RESOURCES_TYPES.ASSET_SENSOR, PERMISSIONS_TYPES.UPDATE),
  validationMiddleware(AssetSensorDtos.CreateAssetSensorDto),
  assetSensorController.linkSensorWithAsset
);

export default router;
