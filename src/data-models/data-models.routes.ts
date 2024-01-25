import express from "express";

import { DataModelsController } from "./data-models.controllers";
import { authentication } from "../middleware/token-authentication";
import { PERMISSIONS_TYPES } from "../common/enums";
import { validationMiddleware } from "../errors/middleware/validation.middleware";
import { CommonDTOs } from "../common/dto";
import { DataModelsDtos } from "./dto/data-models.dto";

const router = express.Router();

const dataModelsController = new DataModelsController();

// Routes
router.post(`/get-joins-clause-by-json`, validationMiddleware(DataModelsDtos.GetJoinsClauseInput), authentication(undefined, PERMISSIONS_TYPES.READ), dataModelsController.getJoinsClausesJSON);

router.post(`/get-graph-data`, validationMiddleware(CommonDTOs.DataModelInput), authentication(undefined, PERMISSIONS_TYPES.READ), dataModelsController.getGraphData);

router.post(
  `/get-data-by-json-query-total-record`,
  //   authentication(null, PERMISSIONS_TYPES.READ),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Get Data By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                  
                  "entity": "User",
                  
                  
              }
           } */
  authentication(undefined, PERMISSIONS_TYPES.READ),
  validationMiddleware(CommonDTOs.DataModelEntity),
  dataModelsController.getDataByPreviousMonthRecored
);

router.post(
  `/get-table-data`,
  //   authentication(null, PERMISSIONS_TYPES.READ),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Get Data By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                  "pagination": {
                      "limit": 10,
                      "offset": 0
                  },
                  "entity": "User",
                  "siteId": "must required",
                  "filterInputString": "{}",
                  "orderBy":""
              }
           } */
  authentication(undefined, PERMISSIONS_TYPES.READ),
  validationMiddleware(CommonDTOs.DataModelInput),
  dataModelsController.getDataByJsonQuery
);
router.post(
  `/get-data-by-json-query`,
  //   authentication(null, PERMISSIONS_TYPES.READ),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Get Data By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                  "pagination": {
                      "limit": 10,
                      "offset": 0
                  },
                  "entity": "User",
                  "siteId": "must required",
                  "filterInputString": "{}",
                  "orderBy":""
              }
           } */
  authentication(undefined, PERMISSIONS_TYPES.READ),
  validationMiddleware(CommonDTOs.DataModelInput),
  dataModelsController.getDataByJsonQueryWithJoins
);

router.post(`/get-data-by-id`, authentication(null, PERMISSIONS_TYPES.READ), dataModelsController.getDataById);

router.post(
  "/create-record-by-json-query",
  authentication(null, PERMISSIONS_TYPES.WRITE),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Create Record By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                   "entity": "Entity",
                   "input": {
                       "column 1": "data",
                       "column 2": "data"
                   }
               }
           } */
  validationMiddleware(CommonDTOs.DataModelInput),
  dataModelsController.createRecordByJsonQuery
);

router.post(
  "/bulk-insert-record-by-json-query",
  //   authentication(null, PERMISSIONS_TYPES.WRITE),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Bulk Insert Records By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                   "entity": "Entity",
                   "input": [
                       {
                           "column 1": "data",
                           "column 2": "data"
                       },
                       {
                           "column 1": "data",
                           "column 2": "data"
                       }
                   ]
               }
           } */
  dataModelsController.bulkInsertRecordsByJsonQuery
);

router.put(
  "/update-record-by-json-query",
  authentication(null, PERMISSIONS_TYPES.UPDATE),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Update Record By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                   "entity": "User",
                   "data": {
                       "id": 1,
                       "input": {
                           "column 1": "data",
                           "column 2": "data"
                       }
                   }
               }
           } */
  dataModelsController.updateRecordByJsonQuery
);

router.put(
  "/bulk-update-record-by-json-query",
  authentication(null, PERMISSIONS_TYPES.UPDATE),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Bulk Update Records By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                   "entity": "Entity",
                   "data": [
                       {
                           "id": 1,
                           "input": {
                               "column 1": "data",
                               "column 2": "data"
                           }
                       },
                       {
                           "id": 1,
                           "input": {
                               "column 1": "data",
                               "column 2": "data"
                           }
                       }
                   ]
               }
           } */
  dataModelsController.bulkUpdateRecordByJsonQuery
);

router.delete(
  "/delete-record-by-json-query",
  //   authentication(null, PERMISSIONS_TYPES.DELETE),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Delete Record By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                   "entity": "Entity",
                   "id": 1,
                   "deleteSoft":true,
               }
           } */
  dataModelsController.deleteRecordByJsonQuery
);

router.delete(
  "/bulk-delete-record-by-json-query",
  //   authentication(null, PERMISSIONS_TYPES.DELETE),
  /* #swagger.tags = ['Data Flow']
           #swagger.description = 'Bulk Delete Records By JSON Query'
           #swagger.parameters['Params'] = {
               in: 'body',
               required: true,
               schema: {
                   "entity": "Entity",
                   "ids": [1, 2, 3]
               }
           } */
  dataModelsController.bulkDeleteRecordByJsonQuery
);

router.post("/table-metadata", validationMiddleware(CommonDTOs.DataModelEntity), dataModelsController.getMetaDataByEntityName);

router.post("/all-tables-with-columns", authentication(), validationMiddleware(CommonDTOs.DataModelEntity), dataModelsController.getMetaDataByEntityName);

export default router;
