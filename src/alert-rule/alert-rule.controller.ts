import { BaseService } from "../base/base.service";
import { Response } from "express";
import { AlertRuleService } from "./alert-rule.service";

export class AlertRuleController extends BaseService {
  private readonly alertRuleService: AlertRuleService;

  constructor() {
    super();
    this.alertRuleService = new AlertRuleService();
  }

  createAlertRule = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const input = req.body;
      const currentUser = req.currentUser;
      const result = await this.alertRuleService.createAlertRule(input, currentUser);
      const jsonString = JSON.stringify(result, (key, value) => {
        if (key === "alertRuleSensor" || key === "alertRule") {
          return undefined;
        }
        return value;
      });

      res.json(JSON.parse(jsonString));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  updateAlertRule = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const input = req.body;
      const currentUser = req.currentUser;
      const { alertRuleId } = req.params;

      const result = await this.alertRuleService.updateAlertRule(input, { id: alertRuleId }, currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getAlertRuleById = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const currentUser = req.currentUser;
      const { alertRuleId } = req.params;

      const result = await this.alertRuleService.getAlertRuleById({ id: alertRuleId });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  deleteAlertRule = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const { alertRuleId } = req.params;

      const result = await this.alertRuleService.deleteAlertRule({ id: alertRuleId });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
