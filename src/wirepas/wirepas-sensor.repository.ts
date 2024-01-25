import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { WirepasSensor } from "./entity/wirepas-sensor.entity";
import { CommonDTOs } from "../common/dto";
import { WirepasData } from "./entity/wirepas-data.entity";
import { DEFAULT_SORT_BY } from "../common/constants";
import { WirepasSensorDto } from "./dto/wirepas-sensor.dto";

export class WirepasSensorRepository extends Repository<WirepasData> {
  public getWirepasSensor(params: CommonDTOs.FilterParam): SelectQueryBuilder<WirepasSensor> {
    return getManager()
      .getRepository(WirepasSensor)
      .createQueryBuilder("wirepasSensor")
      .where({ ...params });
  }

  public getWirepasData(params: CommonDTOs.FilterParam): SelectQueryBuilder<WirepasData> {
    return getManager()
      .getRepository(WirepasData)
      .createQueryBuilder("wirepasData")
      .where({ ...params });
  }

  public getLastWirepasData(): SelectQueryBuilder<WirepasData> {
    return getManager().getRepository(WirepasData).createQueryBuilder("wirepasData").orderBy("wirepasData.createdAt", DEFAULT_SORT_BY);
  }

  public getWirepasSensorByFloorlevelWithJoins(floorlevelId: string, input: WirepasSensorDto.GetWirepasSensor): SelectQueryBuilder<WirepasSensor> {
    const query = getManager()
      .getRepository(WirepasSensor)
      .createQueryBuilder("wirepasSensor")
      .leftJoinAndSelect("wirepasSensor.sensor", "sensor")
      .leftJoinAndSelect("sensor.personnel", "personnel")
      .leftJoin("sensor.assetSensor", "assetSensor")
      .leftJoinAndSelect("assetSensor.asset", "asset")
      .orderBy(`wirepasSensor.createdAt`, DEFAULT_SORT_BY)
      .where({ wirepasFloorlevel: floorlevelId });
    if (input.siteId) {
      query.andWhere({ site: input.siteId });
    }
    if (input.pagination) {
      query.limit(input.pagination.limit).offset(input.pagination.offset);
    }
    return query;
  }

  public getWirepasSensorByFloorlevelWithWirepasData(floorlevelId: string, input: WirepasSensorDto.GetWirepasSensor): SelectQueryBuilder<WirepasSensor> {
    const query = getManager()
      .getRepository(WirepasSensor)
      .createQueryBuilder("wirepasSensor")
      .leftJoinAndSelect("wirepasSensor.wirepasData", "wirepasData")
      .where("wirepasSensor.wirepasFloorlevel = :floorlevelId", { floorlevelId })
      .orderBy("wirepasData.createdAt", DEFAULT_SORT_BY);
    if (input.siteId) {
      query.where({ site: input.siteId });
    }
    if (input.pagination) {
      query.limit(input.pagination.limit).offset(input.pagination.offset);
    }
    return query;
  }
}
