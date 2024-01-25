import { MigrationInterface, QueryRunner } from "typeorm";

export class alert1701777072782 implements MigrationInterface {
  name = "alert1701777072782";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."alert_status_enum" AS ENUM('pending', 'resolved', 'closed')`);

    await queryRunner.query(
      `CREATE TABLE "alert" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."alert_status_enum" NOT NULL, "resolved_by" uuid NOT NULL, "personnel_id" uuid, "site_id" uuid, "alert_rule_id" uuid, "asset_id" uuid, "sensor_id" character varying, CONSTRAINT "REL_52649d8622025086bb0162af12" UNIQUE ("personnel_id"), CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_52649d8622025086bb0162af129" FOREIGN KEY ("personnel_id") REFERENCES "personnel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_a3ea7892cf32f1cc4f3c6e62e4b" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_31f7093e7d556de8331f282c7c1" FOREIGN KEY ("alert_rule_id") REFERENCES "alert_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_8d1857927cf3882329cb46c027d" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "alert" ADD CONSTRAINT "FK_8f85209f12182c382533ef967f4" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_8f85209f12182c382533ef967f4"`);
    await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_8d1857927cf3882329cb46c027d"`);
    await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_31f7093e7d556de8331f282c7c1"`);
    await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_a3ea7892cf32f1cc4f3c6e62e4b"`);
    await queryRunner.query(`ALTER TABLE "alert" DROP CONSTRAINT "FK_52649d8622025086bb0162af129"`);
    await queryRunner.query(`DROP TABLE \`alert\``);
    await queryRunner.query(`DROP TYPE "public"."alert_status_enum"`);
  }
}
