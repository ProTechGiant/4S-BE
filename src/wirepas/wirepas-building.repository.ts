import { Like, Repository, SelectQueryBuilder, getManager, getRepository } from "typeorm";

import { TransformQueryByFilter } from "../common/utils/json-to-object";
import { DEFAULT_SORT_BY } from "../common/constants";
import { WirepasBuildingDtos } from "./dto/building.dto";
import { WirepasBuilding } from "./entity/wirepas-building.entity";
import { CommonDTOs } from "../common/dto";

export class WirepasBuildingRepository extends Repository<WirepasBuilding> {
  public getWirepasBuildingById(wirepasBuildingId: string): SelectQueryBuilder<WirepasBuilding> {
    return getManager().getRepository(WirepasBuilding).createQueryBuilder("wirepasBuilding").where("wirepasBuilding.id = :wirepasBuildingId", { wirepasBuildingId });
  }

  public getWirepasBuildingsWithFloorLevels(filterInput: any | null, input: WirepasBuildingDtos.GetBuildingsDto): SelectQueryBuilder<WirepasBuilding | any> {
    const { pagination } = input;
    let query: SelectQueryBuilder<any>;
    query = getManager().getRepository(WirepasBuilding).createQueryBuilder("wirepasBuilding").leftJoinAndSelect("wirepasBuilding.wirepasFloorlevel", "wirepasFloorlevel");

    if (input.siteId) {
      query.where({ site: input.siteId });
    }

    if (input.orderByColumn) {
      query.orderBy(`${input.orderByColumn}`, input.orderBy ?? DEFAULT_SORT_BY);
    }

    if (!pagination) return query;
    const { offset, limit } = pagination;
    return TransformQueryByFilter(filterInput, query)
      .take(limit)
      .skip(offset * limit);
  }

  public getWirepasBuildingWithSiteById(wirepasBuildingId: string): SelectQueryBuilder<WirepasBuilding> {
    return getManager().getRepository(WirepasBuilding).createQueryBuilder("wirepasBuilding").leftJoinAndSelect("wirepasBuilding.site", "site").where("wirepasBuilding.id = :wirepasBuildingId", { wirepasBuildingId });
  }

  public getBuilding(params: CommonDTOs.FilterParam): SelectQueryBuilder<WirepasBuilding> {
    const query = getManager().getRepository(WirepasBuilding).createQueryBuilder("wirepasBuilding");

    if (params && params.buildingNames) {
      return query.andWhere("wirepasBuilding.name IN (:...buildingNames)", { buildingNames: params.buildingNames });
    } else {
      return query.where({ ...params });
    }
  }

  public getWirepasBuildingForBulkImport(wirepasBuildingsData: WirepasBuildingDtos.GetWirepasBuildingForBulkImportDto[]): SelectQueryBuilder<WirepasBuilding> {
    const query = getRepository(WirepasBuilding).createQueryBuilder("wirepasBuilding").leftJoinAndSelect("wirepasBuilding.organization", "organization").select(["wirepasBuilding.id", "wirepasBuilding.name", "wirepasBuilding.location"]);

    const whereConditions: string[] = [];
    const parameters: { [key: string]: any } = {};
    const organizationParam = `organizationId`,
      nameParam = `name`,
      locationParam = `location`;
    wirepasBuildingsData.forEach((data) => {
      whereConditions.push(`(organization.id = :${organizationParam} OR wirepasBuilding.name LIKE :${nameParam} OR wirepasBuilding.location LIKE :${locationParam})`);
      parameters[organizationParam] = data.organizationId;
      parameters[nameParam] = `%${data.name}%`;
      parameters[locationParam] = `%${data.location}%`;
    });

    query.where(whereConditions.join(" OR "), parameters);
    return query;
  }

  public getWirepasBuildingByIdWithJoins(wirepasBuildingId: number): SelectQueryBuilder<WirepasBuilding> {
    return getManager()
      .getRepository(WirepasBuilding)
      .createQueryBuilder("wirepasBuilding")
      .leftJoinAndSelect("wirepasBuilding.wirepasFloorlevels", "wirepasFloorlevels")
      .leftJoinAndSelect("wirepasBuilding.assets", "assets")
      .leftJoinAndSelect("wirepasFloorlevels.wirepasArea", "wirepasArea")
      .leftJoinAndSelect("wirepasFloorlevels.sensorNodes", "sensorNodes")
      .leftJoinAndSelect("sensorNodes.sensorNodeAlerts", "sensorNodeAlerts")
      .where("wirepasBuilding.id = :wirepasBuildingId", { wirepasBuildingId });
  }

  public getAllWirepasBuildings(filter?: any | null): SelectQueryBuilder<WirepasBuilding> {
    const query = getRepository(WirepasBuilding)
      .createQueryBuilder("wirepasBuilding")
      .leftJoinAndSelect("wirepasBuilding.wirepasFloorlevel", "wirepasFloorlevel")
      .leftJoinAndSelect("wirepasBuilding.assets", "assets")
      .leftJoinAndSelect("wirepasFloorlevel.wirepasArea", "wirepasArea");
    const transformedQuery = TransformQueryByFilter<WirepasBuilding>(filter, query);

    return transformedQuery.orderBy("wirepasBuilding.updatedAt", DEFAULT_SORT_BY);
  }
}
