import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { CommonDTOs } from "../common/dto";
import { Alert } from "./entity/alert.entity";
import { AlertDtos } from "./dto/alert.dto";
import { TransformQueryByFilter } from "../common/utils/json-to-object";

export class AlertRepository extends Repository<Alert> {
  public getAlert(params: CommonDTOs.FilterParam): SelectQueryBuilder<Alert> {
    return getManager().getRepository(Alert).createQueryBuilder("alert").where(params);
  }
  public getAlerts(input: AlertDtos.GetAllAlerts, filterInput: any | null): SelectQueryBuilder<Alert> {
    let query = getManager().getRepository(Alert).createQueryBuilder("alert");

    if (!input.pagination) return query;
    const { offset, limit } = input.pagination;
    return TransformQueryByFilter(filterInput, query)
      .limit(limit)
      .offset(offset * limit);
  }
}
