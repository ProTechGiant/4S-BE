import express from "express";
import { PERMISSIONS_TYPES, RESOURCES_TYPES } from "../common/enums";
import { authentication } from "../middleware/token-authentication";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { AlertRuleController } from "./alert-rule.controller";
import { AlertsRuleDtos } from "./dto/alert-rule.dto";

const alertRuleController = new AlertRuleController();
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

  /* #swagger.tags = ['AlertRule']
   #swagger.description = 'Create AlertRule'
   #swagger.parameters['Params'] = {
       in: 'body',
       required: true,
       schema: {
          "alertType":"personnel",
    "alertSeverity":"low",
    "alertCriteria":"measurment bound",
    "actionType":"email",
    "recepients":[""],
    "sensorId":"",
    "siteId":"",
    "description":""
       }
   }
   #swagger.security = [{
       "Bearer": []
   }]
*/

  authentication(RESOURCES_TYPES.ALERT_RULE, PERMISSIONS_TYPES.WRITE),
  validationMiddleware(AlertsRuleDtos.CreateAlertRuleInput),
  alertRuleController.createAlertRule
);
router.put(
  "/:alertRuleId",
  /* #swagger.tags = ['AlertRule']
   #swagger.description = 'Update AlertRule'
   #swagger.parameters['AlertRuleIdParam'] = {
       in: 'path',
       required: true,
       name: 'alertRuleId',
       type: 'string',
       description: 'ID of the alertRule to update.'
   }
   #swagger.parameters['UpdateAlertRuleData'] = {
       in: 'body',
       required: true,
       schema: {
    "alertType":"personnel",
    "alertSeverity":"low",
    "alertCriteria":"measurment bound",
    "actionType":"email",
    "recepients":[""],
    "sensorId":"",
    "siteId":"",
    "description":""
       }
   }
*/

  authentication(RESOURCES_TYPES.ALERT_RULE, PERMISSIONS_TYPES.UPDATE),
  validationMiddleware(AlertsRuleDtos.UpdateAlertRuleInput),
  alertRuleController.updateAlertRule
);
router.get(
  "/:alertRuleId",

  authentication(RESOURCES_TYPES.ALERT_RULE, PERMISSIONS_TYPES.READ),
  alertRuleController.getAlertRuleById
);
router.delete(
  "/:alertRuleId",
  /* #swagger.tags = ['AlertRule']
   #swagger.description = ' Delete AlertRule'
   #swagger.parameters['DeleteAlertRuleParams'] = {
       in: 'path',
       required: true,
       name: 'alertRuleId',
       type: 'string',
       description: 'ID of the alertRule to  delete.'
   }
*/
  authentication(RESOURCES_TYPES.ALERT_RULE, PERMISSIONS_TYPES.DELETE),
  alertRuleController.deleteAlertRule
);
export default router;
