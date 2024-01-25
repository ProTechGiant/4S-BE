import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { ResetPasswordToken } from "./entity/user-token.entity";


export class ResetPasswordRepository extends Repository<ResetPasswordToken> {
  public getTokenByUserId(userId: string): SelectQueryBuilder<ResetPasswordToken> {
    return getManager().getRepository(ResetPasswordToken).createQueryBuilder("resetPasswordToken").where("resetPasswordToken.user = :userId", { userId });
  }
}
