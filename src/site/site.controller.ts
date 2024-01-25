import { Request, Response } from "express";

import { Site } from "./entity/site.entity";
import { SiteService } from "./site.service";

export class SiteController {
  private readonly siteService: SiteService;

  constructor() {
    this.siteService = new SiteService();
  }

  createSite = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.siteService.createSite(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  updateSite = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const { siteId } = req.params;
    try {
      const result = await this.siteService.updateSite(input, siteId);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  getSiteById = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.params;
    try {
      const result = await this.siteService.getSiteById(input.siteId);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  getAllSites = async (req: RequestTypes, res: Response): Promise<void> => {
    const currentUser = req.currentUser;
    const input = req.body;
    try {
      const result = await this.siteService.getAllSites(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  deleteSite = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.params;
    const currentUser = req.currentUser;
    try {
      const result = await this.siteService.deleteSite(input.siteId, currentUser);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
}
