import { Response } from "express";
import { SensorService } from "./sensor.service";
import { SensorProtocolTypes } from "./enum/sensor.enum";

export class SensorController {
  private readonly sensorService: SensorService;
  constructor() {
    this.sensorService = new SensorService();
  }

  getUnlinkSensors = async (req: RequestTypes, res: Response) => {
    const input = req.body;
    try {
      const result = await this.sensorService.getUnlinkSensors(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getSensors = async (req: RequestTypes, res: Response) => {
    const input = req.body;
    try {
      const result = await this.sensorService.getSensors(input);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteSensor = async (req: RequestTypes, res: Response) => {
    const params = req.params;
    try {
      const result = await this.sensorService.deleteSensor(params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  uploadSensorData = async (req: RequestTypes, res: Response) => {
    const { type, data } = req.body;
    try {
      const result = await this.sensorService.handleUploadSensorData(type, data);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  bulkImportSensors = async (req: RequestTypes, res: Response) => {
    const file = req.files;
    const params = req.params;
    try {
      const result = await this.sensorService.bulkImportSensors(params.protocol as SensorProtocolTypes, file[0]);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
