import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { DataModelsService } from "./data-models.service";

export class DataModelsController {
  private readonly dataModelsService: DataModelsService;

  constructor() {
    this.dataModelsService = new DataModelsService();
  }

  getDataById = async (req: RequestTypes, res: Response): Promise<void> => {
    const { id, tableName, softDelete } = req.body;
    try {
      const result = await this.dataModelsService.findOneById(tableName, id, softDelete);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  getDataByJsonQuery = async (req: RequestTypes, res: Response): Promise<void> => {
    const body = req.body;
    try {
      const result = await this.dataModelsService.getDataByJsonQuery(body);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };
  getDataByJsonQueryWithJoins = async (req: RequestTypes, res: Response): Promise<void> => {
    const body = req.body;
    try {
      const result = await this.dataModelsService.getDataByJsonQueryWithJoins(body);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  getJoinsClausesJSON = async (req: RequestTypes, res: Response): Promise<void> => {
    const body = req.body;
    try {
      const result = await this.dataModelsService.getJoinsClausesJSON(body);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  getGraphData = async (req: RequestTypes, res: Response): Promise<void> => {
    const body = req.body;
    try {
      const result = await this.dataModelsService.getGraphData(body);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  getDataByPreviousMonthRecored = async (req: RequestTypes, res: Response): Promise<void> => {
    const body = req.body;
    try {
      const result = await this.dataModelsService.getDataByPreviousMonthRecored(body);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  getMetaDataByEntityName = async (req: RequestTypes, res: Response): Promise<void> => {
    const body = req.body;
    try {
      const result = await this.dataModelsService.getMetaDataByEntityName(body);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  createRecordByJsonQuery = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.dataModelsService.createRecordByJsonQuery(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  bulkInsertRecordsByJsonQuery = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.dataModelsService.bulkInsertRecordsByJsonQuery(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(HttpStatusCode.InternalServerError).json({ error: errorMessage.message });
    }
  };

  updateRecordByJsonQuery = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.dataModelsService.updateRecordByJsonQuery(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  bulkUpdateRecordByJsonQuery = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.dataModelsService.bulkUpdateRecordByJsonQuery(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(HttpStatusCode.InternalServerError).json({ error: errorMessage.message });
    }
  };

  deleteRecordByJsonQuery = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.dataModelsService.deleteRecordByJsonQuery(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(500).json({ error: errorMessage.message });
    }
  };

  bulkDeleteRecordByJsonQuery = async (req: RequestTypes, res: Response): Promise<void> => {
    const input = req.body;
    try {
      const result = await this.dataModelsService.bulkDeleteRecordByJsonQuery(input);
      res.json(result);
    } catch (errorMessage) {
      res.status(HttpStatusCode.InternalServerError).json({ error: errorMessage.message });
    }
  };
}
