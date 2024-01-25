import express from "express";
import { AreaController } from "./area.controller";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { authentication } from "../middleware/token-authentication";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { AreaDtos } from "./dto/area.dto";

const areaController = new AreaController();
const router = express.Router();

router.post(
  "/",
  /* #swagger.securityDefinitions = {
       "Bearer": {
           "type": "apiKey",
           "name": "Authorization",
           "in": "header"
       }
  } */

  /* #swagger.tags = ['Area']
     #swagger.description = 'Create Area'
     #swagger.parameters['Params'] = {
         in: 'body',
         required: true,
         schema: {
            
      "data": {
      "wirepasFloorlevelId": "",
      "description": "",
      "coordinates": [
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              }
          ],
    
         "r": "",
          "g": "",
          "b": "",
          "a": "",
      
      "siteId": ""
      },
      "protocol": "wirepas"
  }
  
     }
     #swagger.security = [{
         "Bearer": []
     }]
  */

  authentication(RESOURCES_TYPES.AREA, PERMISSIONS_TYPES.WRITE),
  validationMiddleware(AreaDtos.CreateAreaInput),
  areaController.createArea
);
router.get(
  "/:areaId",

  authentication(RESOURCES_TYPES.AREA, PERMISSIONS_TYPES.READ),
  areaController.getArea
);
router.get(
  "/",

  authentication(RESOURCES_TYPES.AREA, PERMISSIONS_TYPES.READ),
  areaController.getAreas
);
router.put(
  "/:areaId",

  /* #swagger.tags = ['Area']
     #swagger.description = 'Update Area'
     #swagger.parameters['AreaIdParam'] = {
         in: 'path',
         required: true,
         name: 'areaId',
         type: 'string',
         description: 'ID of the user to update.'
     }
     #swagger.parameters['UpdateAreaData'] = {
         in: 'body',
         required: true,
         schema: {
           
      "wirepasFloorlevelId": "",
      "description": "",
      "coordinates": [
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              },
              {
                  "latitude": 0,
                  "longitude": 0,
                  "altitude": 0
              }
          ],
    
       
          "g": "",
          "b": "",
          "a": "",
      
      "siteId": ""
  
         }
     }
  */

  authentication(RESOURCES_TYPES.AREA, PERMISSIONS_TYPES.UPDATE),
  validationMiddleware(AreaDtos.UpdateAreaDto),
  areaController.updateArea
);
router.delete(
  "/:areaId",

  /* #swagger.tags = ['Area']
     #swagger.description = ' Delete Area'
     #swagger.parameters['DeleteAreaParams'] = {
         in: 'path',
         required: true,
         name: 'areaId',
         type: 'string',
         description: 'ID of the area to  delete.'
     }
  */
  authentication(RESOURCES_TYPES.AREA, PERMISSIONS_TYPES.DELETE),
  areaController.deleteArea
);
export default router;
