import { camelCase, snakeCase } from "lodash";
import { getManager } from "typeorm";
import { TransactionScope } from "../base/transactionScope";
import { CommonDTOs } from "../common/dto";
import { BaseService } from "../base/base.service";
import { DataModelsRepository } from "./data-models.repository";
import { NoRecordFoundException } from "../errors/exceptions";
import { JsonToObject } from "../common/utils/json-to-object";
import { Asset } from "../asset/entity/asset.entity";
import { Personnel } from "../personnel/entity/personnel.entity";
import { Site } from "../site/entity/site.entity";
import { Alert } from "../alert/entity/alert.entity";
import { Role } from "../role/entity/role.entity";
import { EntityType, JoinTypes } from "../common/enums";
import { WirepasBuilding } from "../wirepas/entity/wirepas-building.entity";
import { WirepasFloorlevel } from "../wirepas/entity/wirepass-floorlevel.entity";
import { AlertRule } from "../alert-rule/entity/alert-rule.entity";
import { Sensor } from "../sensor/entity/sensor.entity";
import { WirepasSensor } from "../wirepas/entity/wirepas-sensor.entity";
import { NarrowbandSensor } from "../narrowband/entity/narrowband-sensor.entity";
import { Area } from "../area/entity/area.entity";
import { UserProfile } from "../user-profile/entity/user-profile.entity";
import { DataModelsDtos } from "./dto/data-models.dto";
import { UndirectedGraph } from "graphology";
import { dijkstra } from "graphology-shortest-path";
import { excludedColumns } from "../common/constants";
import { mockDataForTable } from "./mock";
import { duplicatesRemover } from "./utils/doublicates-remove";

export class DataModelsService extends BaseService {
  private readonly dataModelRepository: DataModelsRepository;

  constructor() {
    super();
    this.dataModelRepository = new DataModelsRepository();
  }

  async commitTransaction(ts: TransactionScope) {
    await ts.commit();
  }

  async findOneById(entity: string, id: string, softDelete?: boolean) {
    const result = await getManager().getRepository(entity).findOne(id, { withDeleted: softDelete });
    if (!result) throw new NoRecordFoundException(`Invalid ${entity} specified`);
    return result;
  }

  async findByIdz(entity: string, idz: number[]) {
    return getManager().getRepository(entity).findByIds(idz);
  }
  async findAll(entity: string, softDelete?: boolean) {
    return getManager().getRepository(entity).find({ withDeleted: softDelete });
  }

  async getDataByJsonQuery(input: CommonDTOs.DataModelInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const filterInput = JsonToObject(input.filterInputString);
      const filterInput2 = input.filterInputString2 ? JsonToObject(input.filterInputString2) : null;
      let uniqueColumnIds, queryParameters;
      if (input.columns) {
        uniqueColumnIds = [
          ...new Set(
            input.columns.map((column) => {
              const [tableId] = column.split(".");
              return `${tableId}.id`;
            })
          ),
        ];
        const extendedColumns = [...uniqueColumnIds, ...input.columns];
        queryParameters = { ...input, columns: extendedColumns };
      }

      const dataModelResult: any = await this.dataModelRepository.getDataByJsonQuery(queryParameters ?? input, filterInput, filterInput2, input.pagination).execute();
      const totalRecords: number = await this.dataModelRepository.getDataByJsonQuery(input, filterInput, input.pagination).getCount();

      let formattedData = dataModelResult.map((record) => {
        const formattedRecord = {};
        for (const [key, value] of Object.entries(record)) {
          const [entity, ...column] = key.split("_");
          formattedRecord[`${entity}.${camelCase(column.join("_"))}`] = value;
        }
        return formattedRecord;
      });

      if (input.uniqueKey) {
        formattedData = duplicatesRemover(formattedData, input.uniqueKey);
      }

      const response = {
        data: formattedData,
        totalRecords,
      };

      return { info: JSON.parse(JSON.stringify(response)) };
    } catch (error) {
      throw new Error(error);
    }
  }
  async getDataByJsonQueryWithJoins(input: CommonDTOs.DataModelInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const filterInput = JsonToObject(input.filterInputString);

      const [dataModelResult, totalRecords] = await this.dataModelRepository.getDataByJsonQuery(input, filterInput, null, input.pagination).getManyAndCount();

      const response = {
        data: dataModelResult,
        totalRecords,
      };

      return { info: JSON.parse(JSON.stringify(response)) };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getGraphData(input: CommonDTOs.DataModelInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const result = JsonToObject(input.filterInputString);

      const response = await this.dataModelRepository.getGraphData(input, result).getRawMany();
      const s = response.map((data) => ({ name: data[input.groupBy], value: +data["Count"] }));

      return { info: JSON.parse(JSON.stringify(s)) };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async getDataByPreviousMonthRecored(input: CommonDTOs.DataModelEntity): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const currentDate = new Date();
      const currentMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const currentMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const lastMonthStartDate = new Date(currentMonthStartDate);
      lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);

      const lastMonthEndDate = new Date(currentMonthEndDate);
      lastMonthEndDate.setMonth(lastMonthEndDate.getMonth() - 1);

      const currentMonthCount = await this.dataModelRepository.getDataByDate(input, [currentMonthStartDate, currentMonthEndDate]).getCount();
      const previousMonthCount = await this.dataModelRepository.getDataByDate(input, [lastMonthStartDate, lastMonthEndDate]).getCount();

      const totalRecords = currentMonthCount + previousMonthCount;
      const percentageChange = totalRecords === 0 ? 0 : ((currentMonthCount - previousMonthCount) / totalRecords) * 100;

      const isIncrease = percentageChange > 0;

      return {
        info: JSON.parse(
          JSON.stringify({
            totalRecords,
            rate: percentageChange,
            status: isIncrease,
          })
        ),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMetaDataByEntityName(input: CommonDTOs.DataModelEntity): Promise<DataModelsDtos.MetaDataResponse[]> {
    try {
      const { entity } = input;
      const snakeCaseEntity = snakeCase(entity);

      const columnInfoQuery = `
  SELECT 
    column_name,
    data_type,
    udt_name as data_type_name,
    character_maximum_length,
    is_nullable,
    column_default,
    ordinal_position
  FROM information_schema.columns
  WHERE table_name = $1
  ORDER BY ordinal_position;
`;
      const columnInfo = await getManager().query(columnInfoQuery, [snakeCaseEntity]);

      const mappedMetaData = columnInfo.map((metadata: DataModelsDtos.MetaDataInfo) => {
        const columnName = metadata.column_name.replace(/(_id)$/, "");
        const columnInCamelcase = camelCase(columnName);
        if (excludedColumns.includes(columnInCamelcase)) {
          return null;
        }

        return {
          columnName: columnInCamelcase,
          dataType: metadata.data_type,
          nullable: Boolean(metadata.is_nullable),
          key: metadata.Key,
          defaultValue: metadata.column_default,
        };
      });

      const filtered = mappedMetaData.filter((e) => e !== null);

      return filtered;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getColumnsByEntityNames(input: string[]): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const entityNamesInSnake = input.map((entityName) => `'${snakeCase(entityName)}'`);
      const tableNamesString = entityNamesInSnake.join(", ");

      const query = `
  SELECT table_name, column_name
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = ANY(ARRAY[${tableNamesString}])
  LIMIT 1000;
`; // `SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.columns WHERE table_schema = 'iot-core' AND TABLE_NAME IN (${entityNamesInSnake.join(",")}) ORDER BY TABLE_NAME`;

      const metadataInfo = await this.getDataBySql(query);

      const finalOutput: { name: string; columns: string[] }[] = [];
      metadataInfo.forEach((item: any) => {
        const tableName = camelCase(item.table_name);
        const columnNames = camelCase(item.column_name.replace(/_id$/, ""));

        if (!excludedColumns.includes(columnNames)) {
          const [tableData] = finalOutput.filter((e) => e.name === tableName);
          if (tableData) {
            tableData.columns.push(columnNames);
          } else {
            finalOutput.push({
              name: tableName,
              columns: [columnNames],
            });
          }
        }
      });

      return { info: JSON.parse(JSON.stringify(finalOutput)) };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createRecordByJsonQuery(inputs: CommonDTOs.CreateDataModelInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const { entity, input } = inputs;
      const entityInstance = this.getEntityInstance(entity);

      for (const [keys, values] of Object.entries(input)) {
        entityInstance[keys] = values;
      }
      const transactionScope = this.getTransactionScope();
      transactionScope.add(entityInstance);
      await this.commitTransaction(transactionScope);
      return { info: JSON.parse(JSON.stringify(entityInstance)) };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async bulkInsertRecordsByJsonQuery(inputs: CommonDTOs.BulkDataModelInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const transactionScope = this.getTransactionScope();
      const records: any[] = [];
      const { entity, input } = inputs;

      for (const item of input) {
        const entityInstance = this.getEntityInstance(entity);

        for (const [keys, values] of Object.entries(item)) {
          entityInstance[keys] = values;
        }
        records.push(entityInstance);
      }
      transactionScope.bulkInsert(records);
      await this.commitTransaction(transactionScope);
      return { info: JSON.parse(JSON.stringify(records)) };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async updateRecordByJsonQuery(inputs: CommonDTOs.DataModelUpdateInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const { entity, data } = inputs;
      const { id, input } = data;
      const transactionScope = this.getTransactionScope();
      const entityInstance: any = await this.findOneById(entity, id);
      if (!entityInstance) {
        throw new Error("Invalid Id for the request");
      }

      if (!input) {
        throw new Error("Invalid Input for the request");
      }

      for (const [keys, values] of Object.entries(entityInstance)) {
        entityInstance[keys] = input[keys] !== undefined ? input[keys] : values;
      }

      transactionScope.update(entityInstance);
      await this.commitTransaction(transactionScope);

      return { info: entityInstance };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async deleteRecordByJsonQuery(input: CommonDTOs.DataModelInput): Promise<CommonDTOs.MessageResponse> {
    try {
      const { entity, id, deleteSoft } = input;
      const result = `${entity}.id = ${id}`;
      const data = await this.dataModelRepository.getDataByJsonQuery(input, result).getOne();
      if (!data) throw new Error("Record does not exists");
      const transactionScope = this.getTransactionScope();
      if (deleteSoft) transactionScope.delete(data);
      else transactionScope.hardDelete(data);
      await this.commitTransaction(transactionScope);
      return { message: `${entity} deleted` };
    } catch (errorMessage) {
      throw new Error(errorMessage.message);
    }
  }

  async bulkDeleteRecordByJsonQuery(inputs: CommonDTOs.DataModelBulkDeleteInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const records: any[] = [];
      const { entity, ids } = inputs;
      const transactionScope = this.getTransactionScope();

      for (const id of ids) {
        const input: any = { ...inputs };
        input.id = id;
        delete input.ids;
        const result = `${entity}.id = ${id}`;
        const data = await this.dataModelRepository.getDataByJsonQuery(input, result).getOne();
        if (!data) throw new Error(`Record does not exists by ${id}`);
        records.push(data);
      }
      transactionScope.deleteCollection(records);
      await this.commitTransaction(transactionScope);
      return { info: JSON.parse(JSON.stringify(records)) };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async getDataBySql(query: string): Promise<any> {
    try {
      return this.dataModelRepository.getDataBySql(query);
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async bulkUpdateRecordByJsonQuery(input: CommonDTOs.BulkUpdateDataModelInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata | Error> {
    try {
      const { entity, data } = input;
      const transactionScope = this.getTransactionScope();
      const records = [];

      for (const item of data) {
        const record: any = await this.findOneById(entity, item.id);
        if (record) {
          record.loadSnapshotForPartialUpdate();
          for (const [keys, values] of Object.entries(record)) {
            record[keys] = item.input[keys] ? item?.input[keys] : values;
          }
          records.push(record);
        }
      }
      if (records.length) {
        transactionScope.updateCollection(records);
        await this.commitTransaction(transactionScope);
      }
      return { info: JSON.parse(JSON.stringify(records)) };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async getDataById(input: CommonDTOs.DataModelInput, param: CommonDTOs.CommonParams): Promise<CommonDTOs.EdiFeedStatisticsMetadata> {
    try {
      const { entity } = input;
      const { id } = param;
      const entityInstance: any = await this.findOneById(entity, id);
      return entityInstance;
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  getEntityInstance(entity: EntityType) {
    switch (entity) {
      case EntityType.ASSET:
        return new Asset();
      case EntityType.BUILDING:
        return new WirepasBuilding();
      case EntityType.FLOORLEVEL:
        return new WirepasFloorlevel();
      case EntityType.ALERT_RULE:
        return new AlertRule();
      case EntityType.ALERT:
        return new Alert();
      case EntityType.PERSONNEL:
        return new Personnel();
      case EntityType.SENSOR:
        return new Sensor();
      case EntityType.WIREPAS_SENSORS:
        return new WirepasSensor();
      case EntityType.NARROWBAND_SENSORS:
        return new NarrowbandSensor();
      case EntityType.AREA:
        return new Area();
      case EntityType.SITE:
        return new Site();
      case EntityType.ROLE:
        return new Role();
      case EntityType.USER_PROFILE:
        return new UserProfile();
      default:
        throw new Error("Invalid Entity Name");
    }
  }

  async getJoinsClausesJSON(input: DataModelsDtos.GetJoinsClauseInput): Promise<CommonDTOs.EdiFeedStatisticsMetadata | Error> {
    try {
      const tableNamesObj = {};

      const defaultJoinType = JoinTypes.LEFT_JOIN;
      const [currentTable, ...otherTables] = input.tables;
      const relationalData = (await this.getRelationshipModel()) as DataModelsDtos.DbRelationshipData;
      const uniqueVertices: Array<string> = [];

      relationalData?.dbRelationalData?.map((item: DataModelsDtos.RelationshipModelFields) => {
        if (!uniqueVertices.includes(item.tableName)) {
          uniqueVertices.push(item.tableName);
        }
        if (!uniqueVertices.includes(item.referencedTableName)) {
          uniqueVertices.push(item.referencedTableName);
        }
      });

      const graph = new UndirectedGraph();

      uniqueVertices.forEach((table: string) => {
        graph.addNode(table);
      });

      relationalData?.dbRelationalData?.map((item: DataModelsDtos.RelationshipModelFields) => {
        const edge = graph.edge(item.tableName, item.referencedTableName);
        if (!edge) {
          graph.addEdge(item.tableName, item.referencedTableName, {
            weight: 1,
          });
        }
      });

      let joinClauseArray = [];
      const uniqueJoinTables = [];
      for (const table of otherTables) {
        // Calculate the shortest path using Dijkstra's algorithm
        try {
          const path = dijkstra.bidirectional(graph, snakeCase(currentTable.name), snakeCase(table.name));
          if (path) {
            for (let j = 0; j < path.length - 1; j++) {
              const rootTable = path[j];
              const refTable = path[j + 1];
              const matchedRechord = relationalData?.dbRelationalData?.find((item) => {
                return (item.tableName === rootTable && item.referencedTableName === refTable) || (item.tableName === refTable && item.referencedTableName === rootTable);
              });

              if (!uniqueJoinTables.includes(rootTable)) {
                uniqueJoinTables.push(rootTable);
              }

              if (matchedRechord?.referencedTableName === rootTable) {
                if (!uniqueJoinTables.includes(matchedRechord.tableName)) {
                  uniqueJoinTables.push(matchedRechord.tableName);

                  const tableAlias = tableNamesObj[matchedRechord.tableName] ?? matchedRechord.tableName;

                  const joinClauseObject = {
                    name: camelCase(tableAlias),
                    joinTo: camelCase(matchedRechord.tableName),
                    joinType: defaultJoinType,
                    joinFrom: camelCase(matchedRechord.referencedTableName),
                  };
                  joinClauseArray.push(joinClauseObject);
                }
              } else if (matchedRechord?.tableName === rootTable) {
                if (!uniqueJoinTables.includes(matchedRechord.referencedTableName)) {
                  uniqueJoinTables.push(matchedRechord.referencedTableName);

                  const tableAlias = tableNamesObj[matchedRechord.referencedTableName] ?? matchedRechord.referencedTableName;

                  const joinClauseObject = {
                    name: camelCase(tableAlias),
                    joinTo: camelCase(matchedRechord.referencedTableName),
                    joinType: defaultJoinType,
                    joinFrom: camelCase(matchedRechord.tableName),
                  };
                  joinClauseArray.push(joinClauseObject);
                }
              }
            }
          }
        } catch (err) {
          console.log("err log in dijkstra find path: ", err);
        }
      }
      const fromClauseArray = {
        joinClauses: joinClauseArray,
      };
      return { info: JSON.parse(JSON.stringify(fromClauseArray)) };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  async getRelationshipModel(): Promise<DataModelsDtos.DbRelationshipData | Error> {
    try {
      let query = `SELECT
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS referenced_table_name,
    af.attname AS referenced_column_name
FROM
    pg_constraint AS c
JOIN
    pg_attribute AS a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN
    pg_attribute AS af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid;`;

      const relationalData = await this.getDataBySql(query);

      let relationshipRecords: DataModelsDtos.RelationshipModelFields[] = [];
      for (const element of relationalData) {
        const newElement: DataModelsDtos.RelationshipModelFields = {
          tableName: element.table_name,
          columnName: element.column_name,
          referencedTableName: element.referenced_table_name,
          referencedColumnName: element.referenced_column_name,
          constraintName: element.constraint_name,
        };
        relationshipRecords.push(newElement);
      }

      return {
        dbRelationalData: relationshipRecords,
      };
    } catch (errorMessage) {
      throw new Error(errorMessage);
    }
  }
}
