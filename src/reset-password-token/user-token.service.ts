import crypto from "crypto";
import { sendMailToUser, sendMailToVerifyUser } from "../common/utils/send-to-user";
import cron from "cron";
import { CommonDTOs } from "../common/dto";
import { User } from "../user/entity/user.entity";
import { ResetPasswordRepository } from "./user-token.repository";
import { BaseService } from "../base/base.service";
import { ResetPasswordToken } from "./entity/user-token.entity";

export class ResetPasswordTokenService extends BaseService {
  private readonly resetPasswordRepository: ResetPasswordRepository;

  constructor() {
    super();
    this.resetPasswordRepository = new ResetPasswordRepository();
  }

  async createTokenAndSendToClient(user: User): Promise<CommonDTOs.MessageResponse> {
    try {
      const token = this.getNewToken();
      let resetPasswordToken: ResetPasswordToken;
      const transactionScope = this.getTransactionScope();

      resetPasswordToken = await this.getTokenByUserId(user.id);

      if (resetPasswordToken) {
        resetPasswordToken.passwordToken = token;
        transactionScope.update(resetPasswordToken);
      } else {
        resetPasswordToken = new ResetPasswordToken();
        resetPasswordToken.user = user;
        resetPasswordToken.passwordToken = token;
        transactionScope.add(resetPasswordToken);
      }

      transactionScope.commit();
      await sendMailToUser(
        user,
        //  process.env.CUSTOMER_APP_URL
        process.env.CUSTOMER_APP_URL + "reset-password/" + user.id + "/" + token
      );
      this.deletePasswordTokenAfter30Min(user.id);

      return { message: "Check your Email to reset your password" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deletePasswordToken(userId: string): Promise<void> {
    try {
      const transactionScope = this.getTransactionScope();
      const resetPasswordToken = await this.getTokenByUserId(userId);

      transactionScope.hardDelete(resetPasswordToken);
      transactionScope.commit();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTokenByUserId(userId: string): Promise<ResetPasswordToken> {
    try {
      const resetPasswordToken = this.resetPasswordRepository.getTokenByUserId(userId).getOne();
      return resetPasswordToken;
    } catch (error) {
      throw new Error(error);
    }
  }

  deletePasswordTokenAfter30Min(userId: string) {
    const cronJob = new cron.CronJob("*/10 * * * *", async () => {
      await this.deletePasswordToken(userId);
    });
    cronJob.start();
  }

  getNewToken = () => crypto.randomBytes(32).toString("hex");
}
