import { Response } from "express";
import { WirepasBuildingService } from "./wirepas-building.service";

export class WirepasBuildingController {
  private readonly wirepasBuildingService: WirepasBuildingService;
  constructor() {
    this.wirepasBuildingService = new WirepasBuildingService();
  }

  createWirepasBuilding = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const currentUser = req.currentUser;
    try {
      const result = await this.wirepasBuildingService.createWirepasBuilding(input, currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getWirepasBuildingWithFloorLevel = async (req: RequestTypes, res: Response): Promise<void> => {
    const { buildingId } = req.params;

    try {
      const result = await this.wirepasBuildingService.getWirepasBuildingWithFloorLevel(buildingId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getWirepasBuildingsWithFloorLevels = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.wirepasBuildingService.getWirepasBuildingsWithFloorLevels(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateWirepasBuilding = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const params = req.params;
    const currentUser = req.currentUser;
    try {
      const result = await this.wirepasBuildingService.updateWirepasBuilding(input, currentUser, params.buildingId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteWirepasBuilding = async (req: RequestTypes, res: Response): Promise<void> => {
    const params = req.params;
    const currentUser = req.currentUser;
    try {
      const result = await this.wirepasBuildingService.deleteWirepasBuilding({ id: params.buildingId }, currentUser);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
