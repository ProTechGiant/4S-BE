import { Repository, SelectQueryBuilder, getManager, getRepository } from "typeorm";
import { CommonDTOs } from "../common/dto";
import { AssetSensor } from "./entity/asset-sensor.entity";
import { Asset } from "../asset/entity/asset.entity";

export class SensorAssetRepository extends Repository<AssetSensor> {
  public getAssetSensor(params: CommonDTOs.FilterParam): SelectQueryBuilder<AssetSensor> {
    return getManager()
      .getRepository(AssetSensor)
      .createQueryBuilder("asset-sensor")
      .where({ ...params });
  }

  public getAssetById(params: CommonDTOs.FilterParam): SelectQueryBuilder<Asset> {
    return getManager()
      .getRepository(Asset)
      .createQueryBuilder("asset")
      .where({ ...params });
  }
}
