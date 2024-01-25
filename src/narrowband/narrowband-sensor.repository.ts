import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { CommonDTOs } from "../common/dto";
import { NarrowbandSensor } from "./entity/narrowband-sensor.entity";

export class NarrowbandSensorRepository extends Repository<NarrowbandSensor> {
  public getNarrowbandSensorBySensorId(sensorId: string): SelectQueryBuilder<NarrowbandSensor> {
    return getManager().getRepository(NarrowbandSensor).createQueryBuilder("narrowbandSensor").where("id = :sensorId", { sensorId });
  }

  public getNarrowbandSensor(params: CommonDTOs.FilterParam): SelectQueryBuilder<NarrowbandSensor> {
    return getManager()
      .getRepository(NarrowbandSensor)
      .createQueryBuilder("narrowbandSensor")
      .where({ ...params });
  }
}
