import { MigrationInterface, QueryRunner } from "typeorm";

export class alertRule1701776996614 implements MigrationInterface {
  name = "alertRule1701776996614";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."alert_rule_type_enum" AS ENUM('personnel', 'asset', 'site', 'low battery', 'sos', 'shutdown', 'pick off', 'sit for a long time', 'location_alert', 'shake', 'Wear', 'Unpacking Alarm', 'charge', 'Unplug the power', 'Sign in', 'Sign out', 'Manual sos shutdown', 'Moved Inside Area', 'Moved Outside Area')`
    );
    await queryRunner.query(`CREATE TYPE "public"."alert_rule_alert_severity_enum" AS ENUM('low', 'medium', 'high')`);
    await queryRunner.query(`CREATE TYPE "public"."alert_rule_alert_criteria_enum" AS ENUM('measurment bound', 'indoor bound', 'outdoor bound')`);
    await queryRunner.query(`CREATE TYPE "public"."alert_rule_action_type_enum" AS ENUM('email', 'sms', 'notify', 'custom')`);

    await queryRunner.query(
      `CREATE TABLE "alert_rule" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."alert_rule_type_enum" NOT NULL DEFAULT 'asset', "alert_severity" "public"."alert_rule_alert_severity_enum" NOT NULL DEFAULT 'low', "alert_criteria" "public"."alert_rule_alert_criteria_enum" NOT NULL DEFAULT 'indoor bound', "action_type" "public"."alert_rule_action_type_enum" NOT NULL DEFAULT 'custom', "recepients" bytea NOT NULL, "created_by" character varying NOT NULL, "description" character varying NOT NULL, "site_id" uuid, "sensor_id" character varying, "area_id" uuid, CONSTRAINT "PK_e9bf555f33872d7b50eb2421a17" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "alert_rule" ADD CONSTRAINT "FK_58b3dd4e9d3b04d5e2edad13ad7" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "alert_rule" ADD CONSTRAINT "FK_5708108a71605fe13671a83e5ce" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "alert_rule" ADD CONSTRAINT "FK_27a167a7d723916326b2436d229" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alert_rule" DROP CONSTRAINT "FK_27a167a7d723916326b2436d229"`);
    await queryRunner.query(`ALTER TABLE "alert_rule" DROP CONSTRAINT "FK_5708108a71605fe13671a83e5ce"`);
    await queryRunner.query(`ALTER TABLE "alert_rule" DROP CONSTRAINT "FK_58b3dd4e9d3b04d5e2edad13ad7"`);
    await queryRunner.query(`DROP TABLE \`alert_rule\``);
    await queryRunner.query(`DROP TYPE "public"."alert_rule_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."alert_rule_alert_severity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."alert_rule_alert_criteria_enum"`);
    await queryRunner.query(`DROP TYPE "public"."alert_rule_action_type_enum"`);
  }
}
