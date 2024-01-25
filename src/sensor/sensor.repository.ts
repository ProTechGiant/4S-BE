import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { Sensor } from "./entity/sensor.entity";
import { SensorProtocolTypes } from "./enum/sensor.enum";
import { TransformQueryByFilter } from "../common/utils/json-to-object";
import { CommonDTOs } from "../common/dto";
import { SensorDto } from "./dto/sensor.dto";
import { DEFAULT_SORT_BY } from "../common/constants";

export class SensorRepository extends Repository<Sensor> {
  public getUnlinkSensors(input: SensorDto.GetSensorWithSiteDto, filterInput: string | { [x: string]: Object }): SelectQueryBuilder<Sensor> {
    const { pagination } = input;
    const query = getManager()
      .getRepository(Sensor)
      .createQueryBuilder("sensor")
      .leftJoinAndSelect("sensor.site", "site")
      .leftJoinAndSelect("sensor.wirepasSensor", "wirepasSensor")
      .leftJoinAndSelect("wirepasSensor.wirepasFloorlevel", "wirepasFloorlevel")
      .leftJoinAndSelect("wirepasFloorlevel.wirepasArea", "wirepasArea")
      .leftJoinAndSelect("wirepasArea.area", "area")
      .where("sensor.asset_id IS  NULL")
      .andWhere("sensor.site_id IS  NULL")
      .andWhere("sensor.personnel_id IS  NULL");

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
  public getSensors(filter: any, protocol: SensorProtocolTypes, siteId: string): SelectQueryBuilder<Sensor> {
    const query = getManager()
      .getRepository(Sensor)
      .createQueryBuilder("sensor")
      .leftJoin("sensor.site", "site")
      .leftJoin("sensor.wirepasSensor", "wirepasSensor")
      .leftJoin("wirepasSensor.wirepasFloorlevel", "wirepasFloorlevel")
      .leftJoin("wirepasFloorlevel.wirepasArea", "wirepasArea")
      .leftJoin("wirepasArea.area", "area")
      .where("sensor.protocol = :protocol", { protocol })
      .andWhere("site.id = :siteId", { siteId });

    if (protocol === SensorProtocolTypes.WIREPAS) {
      query.leftJoinAndSelect("sensor.wirepasSensor", "wirepasSensor").leftJoinAndSelect("wirepasSensor.wirepasData", "wirepasData");
    } else if (protocol === SensorProtocolTypes.NARROWBAND) {
      query.leftJoinAndSelect("sensor.narrowbandSensor", "narrowbandSensor");
    }
    const transformedQuery = TransformQueryByFilter<Sensor>(filter, query);
    return transformedQuery;
  }

  public getSensorById(id: string | number, protocol?: SensorProtocolTypes): SelectQueryBuilder<Sensor> {
    const query = getManager().getRepository(Sensor).createQueryBuilder("sensor").where("id = :id", { id });
    if (protocol) query.andWhere("sensor.protocol = :protocol", { protocol });
    return query;
  }
  public getSensorByIdz(idz: string[]): SelectQueryBuilder<Sensor> {
    return getManager().getRepository(Sensor).createQueryBuilder("sensor").where("sensor.id IN (:...idz)", { idz });
  }
}
