import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { CommonDTOs } from "../common/dto";
import { NarrowbandSensorArea } from "./entity/narrowband-sensor-area.entity";

export class NarrowbandSensorAreaRepository extends Repository<NarrowbandSensorArea> {
  public getNarrowbandSensorArea(params: CommonDTOs.FilterParam): SelectQueryBuilder<NarrowbandSensorArea> {
    return getManager()
      .getRepository(NarrowbandSensorArea)
      .createQueryBuilder("narrowbandSensorArea")
      .where({ ...params });
  }
}
