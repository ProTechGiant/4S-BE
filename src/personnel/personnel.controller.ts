import { Response } from "express";
import { PersonnelService } from "./personnel.service";

export class PersonnelController {
  private readonly personnelService: PersonnelService;

  constructor() {
    this.personnelService = new PersonnelService();
  }

  createPersonnel = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.personnelService.createPersonnel(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  updatePersonnel = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    const { personnelId } = req.params;
    try {
      const result = await this.personnelService.updatePersonnel(input, { id: personnelId });
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
}
