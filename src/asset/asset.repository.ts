import { Repository, SelectQueryBuilder, getManager, getRepository } from "typeorm";
import { AssetDtos } from "./dto/asset.dto";
import { TransformQueryByFilter } from "../common/utils/json-to-object";
import { Asset } from "./entity/asset.entity";
import { CommonDTOs } from "../common/dto";

export class AssetRepository extends Repository<Asset> {
  public getAssetssByIdz(idz: number[]): SelectQueryBuilder<Asset> {
    return getManager().getRepository(Asset).createQueryBuilder().where("asset.id in(:...idz)", { idz });
  }

  public getAssetByIdWithJoins(id: number): SelectQueryBuilder<Asset> {
    return getManager()
      .getRepository(Asset)
      .createQueryBuilder("asset")
      .leftJoinAndSelect("asset.building", "building")
      .leftJoinAndSelect("asset.area", "area")
      .leftJoinAndSelect("asset.floorLevel", "floorLevel")
      .leftJoinAndSelect("asset.sensorNodes", "sensorNodes")
      .leftJoinAndSelect("sensorNodes.sensorNodeDataHistories", "sensorNodeDataHistories")
      .leftJoinAndSelect("sensorNodes.areaSensorNodes", "areaSensorNodes")
      .leftJoinAndSelect("areaSensorNodes.area", "sensorNodeArea")
      .select(["sensorNodeArea.description", "area.description", "asset.*", "sensorNodes.*", "areaSensorNodes.*"])
      .where("asset.id = :id", { id });
  }

  public getAllAssets(filter: any | null): SelectQueryBuilder<Asset> {
    let queryBuilder = getManager()
      .getRepository(Asset)
      .createQueryBuilder("asset")
      .leftJoinAndSelect("asset.building", "building")
      .leftJoinAndSelect("asset.floorLevel", "floorLevel")
      .leftJoinAndSelect("asset.sensorNodes", "sensorNodes")
      .leftJoinAndSelect("asset.organization", "organization")
      .leftJoinAndSelect("asset.area", "area");
    return TransformQueryByFilter(filter, queryBuilder);
  }

  public getAsset(params: CommonDTOs.FilterParam): SelectQueryBuilder<Asset> {
    return getManager()
      .getRepository(Asset)
      .createQueryBuilder("asset")
      .where({ ...params });
  }
}
