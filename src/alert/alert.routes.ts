import express from "express";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { authentication } from "../middleware/token-authentication";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { AlertController } from "./alert.controller";
import { AlertDtos } from "./dto/alert.dto";

const alertController = new AlertController();
const router = express.Router();

router.get(
  "/:alertId",

  authentication(RESOURCES_TYPES.ALERT, PERMISSIONS_TYPES.READ),
  alertController.getAlert
);
router.get(
  "/",

  authentication(RESOURCES_TYPES.ALERT, PERMISSIONS_TYPES.READ),
  alertController.getAlerts
);
router.post(
  "/",
  /* #swagger.tags = ['Alert']
   #swagger.description = 'Create Alert'
   #swagger.parameters['AlertParams'] = {
       in: 'body',
       required: true,
       schema: {
       siteId:"",
       alertRuleId:"",
       sensorId:""    
       }
   }
*/

  authentication(RESOURCES_TYPES.ALERT, PERMISSIONS_TYPES.WRITE),
  validationMiddleware(AlertDtos.CreateAlertInput),
  alertController.createAlert
);
router.delete(
  "/:alertId",
  /* #swagger.tags = ['Alert']
   #swagger.description = 'Soft Delete Alert'
   #swagger.parameters['SoftDeleteAlertParams'] = {
       in: 'path',
       required: true,
       name: 'alertId',
       type: 'string',
       description: 'ID of the alert to soft delete.'
   }
*/

  authentication(RESOURCES_TYPES.ALERT_RULE, PERMISSIONS_TYPES.DELETE),
  alertController.deleteAlert
);
export default router;
