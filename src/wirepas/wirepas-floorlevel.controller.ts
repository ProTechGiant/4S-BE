import { Response } from "express";

import { WirepasFloorlevelService } from "./wirepas-floorlevel.service";
import { BaseService } from "../base/base.service";

export class WirepasFloorlevelController extends BaseService {
  private readonly wirepasFloorlevelService: WirepasFloorlevelService;
  constructor() {
    super();
    this.wirepasFloorlevelService = new WirepasFloorlevelService();
  }

  createWirepasFloorlevel = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const currentUser = req.currentUser;
    try {
      const result = await this.wirepasFloorlevelService.createWirepasFloorlevel(input, currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getWirepasFloorlevel = async (req: RequestTypes, res: Response): Promise<void> => {
    const { floorlevelId } = req.params;
    try {
      const result = await this.wirepasFloorlevelService.getWirepasFloorlevelWithJoins(floorlevelId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getWirepasFloorlevelByBuilding = async (req: RequestTypes, res: Response): Promise<void> => {
    const { buildingId } = req.params;
    const input = req.body;
    try {
      const result = await this.wirepasFloorlevelService.getWirepasFloorlevelByBuilding(buildingId, input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateWirepasFloorlevel = async (req: RequestTypes, res: Response): Promise<void> => {
    const { floorlevelId } = req.params;
    const input = req.body;
    const currentUser = req.currentUser;
    try {
      const result = await this.wirepasFloorlevelService.updateWirepasFloorlevel(input, { id: floorlevelId }, currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  uploadWirepasFloorlevelImage = async (req: RequestTypes, res: Response): Promise<void> => {
    const { floorlevelId } = req.params;
    const file = req.files;
    const currentUser = req.currentUser;
    try {
      const result = await this.wirepasFloorlevelService.uploadWirepasFloorlevelImage({ id: floorlevelId }, file[0], currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteWirepasFloorlevel = async (req: RequestTypes, res: Response): Promise<void> => {
    const params = req.params;
    const currentUser = req.currentUser;
    try {
      const result = await this.wirepasFloorlevelService.deleteWirepasFloorlevel({ id: params.floorlevelId }, currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
