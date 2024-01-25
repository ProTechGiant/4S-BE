import { Repository, SelectQueryBuilder, getManager } from "typeorm";

import { Personnel } from "./entity/personnel.entity";
import { CommonDTOs } from "../common/dto";

export class PersonnelRepository extends Repository<Personnel> {
  public getPersonnels(params: CommonDTOs.FilterParam): SelectQueryBuilder<Personnel> {
    return getManager().getRepository(Personnel).createQueryBuilder("personnel").where(params);
  }
}
