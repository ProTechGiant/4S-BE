import { Response } from "express";
import { ResourceService } from "./resource.service";

export class ResourceController {
  private readonly resourceService: ResourceService;

  constructor() {
    this.resourceService = new ResourceService();
  }

  getUserResource = async (req: RequestTypes, res: Response): Promise<void> => {
    const currentResource = req.currentUser;
    try {
      const result = await this.resourceService.getUserResource(currentResource);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  getUserResourceWithColumnNames = async (req: RequestTypes, res: Response): Promise<void> => {
    const currentResource = req.currentUser;
    try {
      const result = await this.resourceService.getUserResourceWithColumnNames(currentResource);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
}
