import { MigrationInterface, QueryRunner } from "typeorm";
import { Site } from "../entity/site.entity";
import { BaseService } from "../../base/base.service";

export class site1698666935012 extends BaseService implements MigrationInterface {
  public async up(): Promise<void> {
    try {
      const site = new Site();
      const transactionScope = this.getTransactionScope();

      site.name = "First Site";

      transactionScope.add(site);
      await transactionScope.commit();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
