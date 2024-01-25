import { MigrationInterface, QueryRunner } from "typeorm";

export class alertRule1705325008552 implements MigrationInterface {
  name = "update_alertRule1705325008552";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE "public"."alert_rule_alert_criteria_enum"`);
    await queryRunner.query(`DROP TYPE "public"."alert_rule_type_enum"`);
    await queryRunner.query(`CREATE TYPE "public"."alert_rule_alert_criteria_enum" AS ENUM("range","above","below","exact","area indoor inbound","area world inbound"," area indoor outbound"," area word outbound",)`);
    await queryRunner.query(`CREATE TYPE "public"."alert_rule_type_enum" AS ENUM('measurement','area')`);
    await queryRunner.query(`ALTER TABLE "alert_rule" DROP CONSTRAINT "FK_5708108a71605fe13671a83e5ce"`);
    await queryRunner.query(`ALTER TABLE "alert_rule" DROP COLUMN "sensor_id"`);
    await queryRunner.query(`ALTER TABLE "alert_rule" DROP COLUMN "action_type"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."alert_rule_action_type_enum"`);
    await queryRunner.query(`CREATE TYPE "public"."alert_rule_action_type_enum" AS ENUM('email', 'sms', 'notify', 'custom')`);
    await queryRunner.query(`ALTER TABLE "alert_rule" ADD "action_type" "public"."alert_rule_action_type_enum" array NOT NULL DEFAULT '{custom}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alert_rule" DROP COLUMN "action_type"`);
    await queryRunner.query(`CREATE TYPE "public"."alert_rule_action_type_enum" AS ENUM('email', 'sms', 'notify', 'custom')`);
    await queryRunner.query(`ALTER TABLE "alert_rule" ADD "action_type" "public"."alert_rule_action_type_enum" NOT NULL DEFAULT 'custom'`);
    await queryRunner.query(`ALTER TABLE "alert_rule" ADD "sensor_id" character varying`);
    await queryRunner.query(`ALTER TABLE "alert_rule" ADD CONSTRAINT "FK_5708108a71605fe13671a83e5ce" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`DROP TYPE "public"."alert_rule_alert_criteria_enum"`);
    await queryRunner.query(`DROP TYPE "public"."alert_rule_type_enum"`);
  }
}
