import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { CommonDTOs } from "../common/dto";
import { DataModels } from "./entity/data-models.entity";
import { TransformQueryByFilter } from "../common/utils/json-to-object";
import { DEFAULT_SORT_BY } from "../common/constants";
import { JoinTypes } from "../common/enums";
import { camelCase } from "lodash";

export class DataModelsRepository extends Repository<DataModels> {
  public getById(param: CommonDTOs.CommonParams): SelectQueryBuilder<DataModels> {
    const { id } = param;
    return this.createQueryBuilder("data_models").select().where("data_models.id = :id", { id });
  }

  public getDataByDate(input: CommonDTOs.DataModelEntity, date: Date[]): SelectQueryBuilder<any> {
    return getManager().getRepository(input.entity).createQueryBuilder(input.entity).where(`${input.entity}.created_at BETWEEN :startDate AND :endDate`, {
      startDate: date[0],
      endDate: date[1],
    });
  }

  public getDataByJsonQuery(input: CommonDTOs.DataModelInput, filterInput: any | null, filterInput2?: any | null, pagination?: CommonDTOs.PaginationInput): SelectQueryBuilder<any> {
    let query = getManager().getRepository(input.entity).createQueryBuilder(camelCase(input.entity));

    for (let i = 0; i < input?.joinTables?.length; i++) {
      query =
        input?.joinTables[i].joinType == JoinTypes.INNER_JOIN
          ? query.innerJoinAndSelect(`${input?.joinTables[i].joinFrom}.${input?.joinTables[i].joinTo}`, input?.joinTables[i].name)
          : query.leftJoinAndSelect(`${input?.joinTables[i].joinFrom}.${input?.joinTables[i].joinTo}`, input?.joinTables[i].name);
    }

    if (input.columns?.length) {
      const columnsToSelect = input.columns.map((column) => `${column}`);
      query = query.select(columnsToSelect);
    }
    if (input.id) {
      query = query.where({ id: input.id });
    }
    if (input.orderByColumn) {
      query.orderBy(`${input.orderByColumn}`, input.orderBy ?? DEFAULT_SORT_BY);
    }
    if (input.uniqueKey) {
      const entityName = input.uniqueKey.split(".")[0];
      query.groupBy(`${camelCase(entityName)}.id`);
    }
    if (filterInput2) {
      query = TransformQueryByFilter<unknown>(filterInput2, query);
    }

    if (!pagination) return query;
    const { offset, limit } = pagination;
    query = TransformQueryByFilter<unknown>(filterInput, query);
    return query.limit(limit).offset(offset * limit);
  }

  public async getDataBySql(query: string): Promise<SelectQueryBuilder<any> | Error> {
    try {
      const result = await getManager().query(query);
      return result;
    } catch (errorMessage) {
      return new Error(errorMessage);
    }
  }

  getGraphData(input: CommonDTOs.DataModelInput, result: any | null): SelectQueryBuilder<any> {
    let query = getManager().getRepository(input.entity).createQueryBuilder(input.entity).select(`${input.entity}.${input.groupBy}`, `${input.groupBy}`).addSelect(`COUNT(${input.entity}.${input.groupBy})`, "Count");

    return TransformQueryByFilter<unknown>(result, query).groupBy(`${input.entity}.${input.groupBy}`);
  }
}
