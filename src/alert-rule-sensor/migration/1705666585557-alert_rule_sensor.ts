import { MigrationInterface, QueryRunner } from "typeorm";

export class alertRuleSensor1705666585557 implements MigrationInterface {
  name = "alertRuleSensor1705666585557";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "alert_rule_sensor" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alert_rule_id" uuid, "sensor_id" character varying, CONSTRAINT "PK_5708108a71605fe13671a83e5ce" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "alert_rule_sensor" ADD CONSTRAINT "FK_49aeb0a9c8c5d86254e32d353da" FOREIGN KEY ("alert_rule_id") REFERENCES "alert_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "alert_rule_sensor" ADD CONSTRAINT "FK_aeb3472d920dbc7df30986456a0" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alert_rule_sensor" DROP CONSTRAINT "FK_aeb3472d920dbc7df30986456a0"`);
    await queryRunner.query(`ALTER TABLE "alert_rule_sensor" DROP CONSTRAINT "FK_49aeb0a9c8c5d86254e32d353da"`);
    await queryRunner.query(`DROP TABLE "alert_rule_sensor"`);
  }
}
