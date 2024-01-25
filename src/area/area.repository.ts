import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { Area } from "./entity/area.entity";
import { CommonDTOs } from "../common/dto";

export class AreaRepository extends Repository<Area> {
  public getArea(params?: CommonDTOs.FilterParam): SelectQueryBuilder<Area> {
    const query = getManager().getRepository(Area).createQueryBuilder("area");

    if (params) {
      if (params?.wirepasFloorlevel) {
        query.leftJoinAndSelect("area.wirepasArea", "wirepasArea").leftJoinAndSelect("wirepasArea.wirepasFloorlevel", "wirepasFloorlevel").where("wirepasFloorlevel.id = :wirepasFloorlevel", { wirepasFloorlevel: params.wirepasFloorlevel });
      } else {
        query.where({ ...params });
      }
    }

    return query;
  }
  public getAreas(): SelectQueryBuilder<Area> {
    return getManager().getRepository(Area).createQueryBuilder("area");
  }
  public getAreasBySensorIdz(idz): SelectQueryBuilder<Area> {
    return getManager().getRepository(Area).createQueryBuilder("area").where("wirepasArea.sensor_id IN (:...idz)", { idz });
  }
}
