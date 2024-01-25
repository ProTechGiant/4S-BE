import { getManager, Repository, SelectQueryBuilder } from "typeorm";
import { CommonDTOs } from "../common/dto";
import { NarrowbandLocationData } from "./entity/narrowband-location-data.entity";

export class NarrowbandLocationDataRepository extends Repository<NarrowbandLocationData> {
  public getLastNarrowbandLocationData(): SelectQueryBuilder<NarrowbandLocationData> {
    return getManager()
      .getRepository(NarrowbandLocationData)
      .createQueryBuilder("narrowbandLocationData")
      .orderBy("narrowbandLocationData.createdAt", "DESC");
  }
}
