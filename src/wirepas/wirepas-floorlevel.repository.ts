import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { WirepasFloorlevel } from "./entity/wirepass-floorlevel.entity";
import { CommonDTOs } from "../common/dto";
import { TransformQueryByFilter } from "../common/utils/json-to-object";
import { WirepasFloorlevelDtos } from "./dto/wirepas-floorlevel.dto";
import { DEFAULT_SORT_BY } from "../common/constants";

export class WirepasFloorlevelRepository extends Repository<WirepasFloorlevel> {
  public getWirepasFloorlevelId(id: string): SelectQueryBuilder<WirepasFloorlevel> {
    return getManager().getRepository(WirepasFloorlevel).createQueryBuilder("wirepasFloorlevel").leftJoinAndSelect("wirepasFloorlevel.wirepasBuilding", "wirepasBuilding").where("wirepasFloorlevel.id = :id", { id });
  }

  public getWirepasFloorlevel(params?: CommonDTOs.FilterParam): SelectQueryBuilder<WirepasFloorlevel> {
    const query = getManager().getRepository(WirepasFloorlevel).createQueryBuilder("wirepasFloorlevel").leftJoinAndSelect("wirepasFloorlevel.wirepasBuilding", "wirepasBuilding");
    if (params) query.where({ ...params });
    return query;
  }

  public getWirepasFloorlevelWithJoins(floorlevelId: string): SelectQueryBuilder<WirepasFloorlevel> {
    return getManager()
      .getRepository(WirepasFloorlevel)
      .createQueryBuilder("wirepasFloorlevel")
      .leftJoinAndSelect("wirepasFloorlevel.wirepasArea", "wirepasArea")
      .leftJoinAndSelect("wirepasArea.area", "area")
      .leftJoinAndSelect("wirepasFloorlevel.wirepasSensor", "wirepasSensor")
      .leftJoinAndSelect("wirepasSensor.sensor", "sensor")
      .where({ id: floorlevelId });
  }
  public getWirepasFloorlevelByBuilding(buildingId: string, filterInput: any | null, input: WirepasFloorlevelDtos.GetFloorlevelDto): SelectQueryBuilder<WirepasFloorlevel | unknown> {
    const { pagination } = input;
    let query: SelectQueryBuilder<unknown>;
    query = getManager().getRepository(WirepasFloorlevel).createQueryBuilder("wirepasFloorlevel").where({ wirepasBuilding: buildingId });

    if (input.orderByColumn) {
      query.orderBy(`${input.orderByColumn}`, input.orderBy ?? DEFAULT_SORT_BY);
    }

    return TransformQueryByFilter<unknown>(filterInput, query)
      .limit(pagination.limit)
      .offset(pagination.offset * pagination.limit);
  }
}
