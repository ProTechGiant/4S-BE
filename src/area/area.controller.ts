import { BaseService } from "../base/base.service";
import { Response } from "express";
import { AreaService } from "./area.service";
import { HttpStatusCode } from "axios";

export class AreaController extends BaseService {
  private readonly areaService: AreaService;

  constructor() {
    super();
    this.areaService = new AreaService();
  }

  createArea = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const input = req.body;
      const currentUser = req.currentUser;

      const result = await this.areaService.createArea(input, currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getArea = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const params = req.params;

      const result = await this.areaService.getArea({ id: params.areaId });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getAreas = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const result = await this.areaService.getAreas();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateArea = async (req: RequestTypes, res: Response): Promise<void> => {
    try {
      const input = req.body;
      const params = req.params;
      const currentUser = req.currentUser;
      const result = await this.areaService.updateArea(input, { id: params.areaId }, currentUser);
      res.json(result);
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error: error.message });
    }
  };

  deleteArea = async (req: RequestTypes, res: Response): Promise<void> => {
    const params = req.params;
    const currentUser = req.currentUser;
    try {
      const result = await this.areaService.deleteArea({ id: params.areaId }, currentUser);
      res.json(result);
    } catch (error) {
      res.status(HttpStatusCode.InternalServerError).json({ error: error.message });
    }
  };
}
