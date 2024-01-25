import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { Site } from "./entity/site.entity";
import { CommonDTOs } from "../common/dto";
import { SiteDtos } from "./dto/site.dto";
import { TransformQueryByFilter } from "../common/utils/json-to-object";
import { DEFAULT_SORT_BY } from "../common/constants";

export class SiteRepository extends Repository<Site> {
  public getSiteById(id: string): SelectQueryBuilder<Site> {
    return getManager().getRepository(Site).createQueryBuilder("site").where("id = :id", { id });
  }

  public getAllSites(input?: SiteDtos.GetAllSiteInput, filterInput?: any | null): SelectQueryBuilder<Site> {
    let query: SelectQueryBuilder<Site>;
    query = getManager().getRepository(Site).createQueryBuilder("site");
    if (input.orderByColumn) {
      query.orderBy(`${input.orderByColumn}`, input.orderBy ?? DEFAULT_SORT_BY);
    }
    if (!input.pagination) return query;
    const { offset, limit } = input.pagination;
    return TransformQueryByFilter(filterInput, query)
      .take(limit)
      .skip(offset * limit);
  }
}
