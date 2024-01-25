import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { WirepasArea } from "./entity/wirepas-area.entity";
import { CommonDTOs } from "../common/dto";

export class WirepasAreaRepository extends Repository<WirepasArea> {
  public getWirepasAreaByIdz(idz: string[]): SelectQueryBuilder<WirepasArea> {
    return getManager().getRepository(WirepasArea).createQueryBuilder("wirepasArea").where("wirepasArea.id IN (:...idz)", { idz });
  }

  public getWirepasArea(params: CommonDTOs.FilterParam): SelectQueryBuilder<WirepasArea> {
    return getManager()
      .getRepository(WirepasArea)
      .createQueryBuilder("wirepasArea")
      .leftJoinAndSelect("wirepasArea.wirepasFloorlevel", "wirepasFloorlevel")
      .where({ ...params });
  }
}
