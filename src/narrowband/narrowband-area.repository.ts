import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { NarrowbandArea } from "./entity/narrowband-area.entity";
import { CommonDTOs } from "../common/dto";

export class NarrowbandAreaRepository extends Repository<NarrowbandArea> {
  public getNarrowbandAreaByIdz(idz: string[]): SelectQueryBuilder<NarrowbandArea> {
    return getManager().getRepository(NarrowbandArea).createQueryBuilder("narrowbandArea").where("narrowbandArea.id IN (:...idz)", { idz });
  }

  public getNarrowbandArea(params: CommonDTOs.FilterParam): SelectQueryBuilder<NarrowbandArea> {
    return getManager()
      .getRepository(NarrowbandArea)
      .createQueryBuilder("narrowbandArea")
      .where({ ...params });
  }
}
