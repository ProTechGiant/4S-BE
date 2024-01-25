import { Response } from "express";
import { AssetSensorService } from "./asset-sensor.service";

export class AssetSenosrController {
  private readonly assetSensorService: AssetSensorService;
  constructor() {
    this.assetSensorService = new AssetSensorService();
  }

  deleteAssetSensor = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.assetSensorService.deleteAssetSensor({ id: input.assetId, sensor: input.sensorId });
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  updateAssetSensor = async (req: RequestTypes, res: Response): Promise<void> => {
    const { assetSensorId } = req.params;
    const input = req.body;
    try {
      const result = await this.assetSensorService.updateAssetSensor(input, { id: assetSensorId });
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  createAssetSensor = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.assetSensorService.createAssetSensor(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  linkSensorWithAsset = async (req: RequestTypes, res: Response) => {
    const input = req.body;
    try {
      const result = await this.assetSensorService.linkSensorWithAsset(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
