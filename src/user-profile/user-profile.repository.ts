import { Repository, SelectQueryBuilder, getManager } from "typeorm";

import { UserProfile } from "./entity/user-profile.entity";
import { CommonDTOs } from "../common/dto";

export class UserProfileRepository extends Repository<UserProfile> {
  public getUserProfile(params: CommonDTOs.FilterParam): SelectQueryBuilder<UserProfile> {
    return getManager().getRepository(UserProfile).createQueryBuilder("userProfile").where({ ...params });
  }
}
