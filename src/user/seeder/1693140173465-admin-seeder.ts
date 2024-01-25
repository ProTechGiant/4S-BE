import dotenv from "dotenv";
import { MigrationInterface, QueryRunner } from "typeorm";
import { BaseService } from "../../base/base.service";
import { WntGatewayService } from "../../sockets/wnt-gateway.service";
import { getWntUserFormat, wntUserFormat } from "../utils/parser";
import { User } from "../entity/user.entity";
import { hashPassword } from "../../common/utils/bcrypt";
import { WntServiceType } from "../../sockets/enum/wnt-gateway.enum";
import { WntUsersType } from "../../constants/status-codes";
import { UserProfileService } from "../../user-profile/user-profile.service";

const environment = process.env.NODE_ENV;
dotenv.config({ path: `.env.${environment}` });

export class AdminSeeder1693140173465 extends BaseService implements MigrationInterface {
  private wntGatewayService: WntGatewayService;
  private userProfileService: UserProfileService;

  constructor() {
    super();
    this.wntGatewayService = new WntGatewayService();
    this.userProfileService = new UserProfileService();
  }

  public async up(): Promise<void> {
    try {
      const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
      const user = new User();
      const transactionScope = this.getTransactionScope();
      user.firstName = process.env.ADMIN_FIRST_NAME;
      user.lastName = process.env.ADMIN_LAST_NAME;
      user.email = process.env.ADMIN_EMAIL;
      user.password = hashedPassword;
      user.phoneNumber = process.env.ADMIN_PHONE_NUMBER;
      user.isSuperAdmin = true;

      const getUserFormat = getWntUserFormat();
      const result = (await this.wntGatewayService.handleSendRequest(getUserFormat, { email: process.env.WNT_ATH_USERNAME, password: process.env.WNT_ATH_PASSWORD }, WntServiceType.USER)) as any;
      const wntUserAlreadyExist = true;
      result.data.users.find((item) => item.username === user.email);

      if (!wntUserAlreadyExist) {
        const createUserFormat = wntUserFormat({ email: user.email, password: hashedPassword, name: user.firstName + " " + user.lastName, role: 1 }, WntUsersType.CREATE);
        await this.wntGatewayService.handleSendRequest(createUserFormat, { email: process.env.WNT_ATH_USERNAME, password: process.env.WNT_ATH_PASSWORD }, WntServiceType.USER);
      }

      transactionScope.add(user);
      await this.userProfileService.createProfileUser(user, undefined, transactionScope, true);
      await transactionScope.commit();
      delete user.userRole;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user`);
    await queryRunner.query(`DELETE FROM admin_roles`);
  }
}
