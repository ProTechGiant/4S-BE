import { MigrationInterface, QueryRunner } from "typeorm";

export class update_alert1704886569328 implements MigrationInterface {
  name = "update_alert1704886569328";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alert" ALTER COLUMN "resolved_by" DROP NOT NULL`);

    await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_8f85209f12182c382533ef967f4"`);
    await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_8f85209f12182c382533ef967f4" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_8f85209f12182c382533ef967f4"`);
    await queryRunner.query(`ALTER TABLE "alert" ALTER COLUMN "resolved_by" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_8f85209f12182c382533ef967f4" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
