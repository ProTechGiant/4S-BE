import { MigrationInterface, QueryRunner } from "typeorm";

export class assetSensor1701776802209 implements MigrationInterface {
  name = "assetSensor1701776802209";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "asset_sensor" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sensor_id" character varying, "asset_id" uuid, CONSTRAINT "PK_c3ebc9b9d71414abdc1485af426" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(`ALTER TABLE "asset_sensor" ADD CONSTRAINT "FK_12e540a2af6457eedb76a83cc89" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "asset_sensor" ADD CONSTRAINT "FK_97c8ca2c168d249097364cdd744" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset_sensor" DROP CONSTRAINT "FK_97c8ca2c168d249097364cdd744"`);
    await queryRunner.query(`ALTER TABLE "asset_sensor" DROP CONSTRAINT "FK_12e540a2af6457eedb76a83cc89"`);
    await queryRunner.query(`DROP TABLE \`asset_sensor\``);
  }
}
