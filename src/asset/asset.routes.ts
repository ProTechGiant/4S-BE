import express from "express";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { AssetDtos } from "./dto/asset.dto";
import { AssetController } from "./asset.controller";
import { authentication } from "../middleware/token-authentication";
import uploadFilesMiddleware from "../middleware/multar.uploader";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";

const router = express.Router();
const assetController = new AssetController();

router.post(
  "/",
  authentication(RESOURCES_TYPES.ASSET, PERMISSIONS_TYPES.WRITE),
  /* #swagger.tags = ['Asset']
   #swagger.description = 'Create Asset'
   #swagger.parameters['CreateAssetParams'] = {
       in: 'body',
       required: true,
       schema: 
       {
        "name":"",
    "model":"",
    "serialNumber":"",
    "warrantyDate":"2023-09-20T10:00:00Z",
    "issueDate":"2023-09-20T10:00:00Z",
    "wirepasFloorLevelId":"",
    "wirepasBuildingId":"",
    "siteId":"",
    "deviceType":"",
    "image":""
       }
   } 
*/
  validationMiddleware(AssetDtos.CreateAssetDto),
  assetController.createAsset
);

router.put(
  "/:assetId",
  authentication(RESOURCES_TYPES.ASSET, PERMISSIONS_TYPES.UPDATE),
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
        "name":"",
    "model":"",
    "serialNumber":"",
    "warrantyDate":"2023-09-20T10:00:00Z",
    "issueDate":"2023-09-20T10:00:00Z",
    "wirepasFloorLevelId":"",
    "wirepasBuildingId":"",
    "siteId":"",
    "deviceType":"",
    "image":""
       }
   }
     
*/

  validationMiddleware(AssetDtos.UpdateAssetDto),
  assetController.updateAsset
);

router.delete(
  "/:assetId",
  authentication(RESOURCES_TYPES.ASSET, PERMISSIONS_TYPES.DELETE),
  /* #swagger.tags = ['Asset']
   #swagger.description = 'Delete Asset'
   #swagger.parameters['AssetIdParam'] = {
       in: 'path',
       required: true,
       name: 'assetId',
       type: 'integer',
       description: 'ID of the asset to delete.'
   }
     
   */
  assetController.deleteAsset
);

router.post(
  "/bulk-import",
  /* #swagger.tags = ['Asset']
          #swagger.consumes = ['multipart/form-data']  
          #swagger.parameters['singleFile'] = {
              in: 'formData',
              type: 'file',
              required: 'true',
              description: 'bulk insert data',
            
              }
                #swagger.parameters['UpdateAssetParams'] = {
               in: 'body',
               required:'true',
               schema:{
                protocole:""
               }

        } */
  authentication(RESOURCES_TYPES.ASSET, PERMISSIONS_TYPES.WRITE),
  uploadFilesMiddleware,
  assetController.bulkImportAsset
);

export default router;
