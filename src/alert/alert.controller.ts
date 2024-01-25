import { BaseService } from "../base/base.service";
import { Response } from "express";
import { AlertService } from "./alert.service";

export class AlertController extends BaseService {
  private readonly alertService: AlertService;

  constructor() {
    super();
    this.alertService = new AlertService();
  }

  createAlert = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const input = req.body;
      const currentUser = req.currentUser;

      const result = await this.alertService.createAlert(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getAlert = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const { alertId } = req.params;

      const [result] = await this.alertService.getAlert({ id: alertId });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getAlerts = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const input = req.body;
      const result = await this.alertService.getAlerts(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteAlert = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const { alertRuleId } = req.params;

      const result = await this.alertService.deleteAlert({ id: alertRuleId });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
