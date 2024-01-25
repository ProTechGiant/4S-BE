import { Response } from "express";
import { AssetService } from "./asset.service";

export class AssetController {
  private readonly assetService: AssetService;
  constructor() {
    this.assetService = new AssetService();
  }

  createAsset = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.assetService.createAsset(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  updateAsset = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const { assetId } = req.params;

    try {
      const result = await this.assetService.updateAsset(input, { id: assetId });
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  deleteAsset = async (req: RequestTypes, res: Response): Promise<void> => {
    const { assetId } = req.params;
    try {
      const result = await this.assetService.deleteAsset({ id: assetId });
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  bulkImportAsset = async (req: RequestTypes, res: Response) => {
    const file = req.files;
    try {
      const result = await this.assetService.bulkImportAsset(file[0]);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
