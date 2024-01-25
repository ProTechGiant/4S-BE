import { Response } from "express";

import { WirepasSensorService } from "./wirepas-sensor.service";

export class WirepasSensorController {
  private readonly wirepasSensorService: WirepasSensorService;
  constructor() {
    this.wirepasSensorService = new WirepasSensorService();
  }

  createWirepasBuilding = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    res.json(input);
    /* try {
      const result = await this.wirepasSensorService.createWirepasSensor(input);
    } catch (error) {
      res.status(500).json({ error: error.message });
    } */
  };
  getWirepasSensorByFloorlevelId = async (req: RequestTypes, res: Response): Promise<void> => {
    const { floorlevelId } = req.params;
    const input = req.body;
    try {
      const result = await this.wirepasSensorService.getWirepasSensorByFloorlevelWithJoins(floorlevelId, input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
