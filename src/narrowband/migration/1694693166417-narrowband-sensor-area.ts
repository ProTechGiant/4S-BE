import { MigrationInterface, QueryRunner } from "typeorm";

export class narrowbandSensorArea1701777505858 implements MigrationInterface {
  name = "narrowbandSensorArea1701777505858";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "narrowband_sensor_area" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "narrowband_sensor_id" character varying, "narrowband_area_id" uuid, CONSTRAINT "PK_1f396c18298fca9f878bc69d600" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "narrowband_sensor_area" ADD CONSTRAINT "FK_c0e15aca36a3d223a0b343ff6d7" FOREIGN KEY ("narrowband_sensor_id") REFERENCES "narrowband_sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "narrowband_sensor_area" ADD CONSTRAINT "FK_96a0c47ad24fcad8d1f711954b8" FOREIGN KEY ("narrowband_area_id") REFERENCES "narrowband_area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "narrowband_sensor_area" DROP CONSTRAINT "FK_96a0c47ad24fcad8d1f711954b8"`);
    await queryRunner.query(`ALTER TABLE "narrowband_sensor_area" DROP CONSTRAINT "FK_c0e15aca36a3d223a0b343ff6d7"`);

    await queryRunner.query(`DROP TABLE "narrowband_sensor_area"`);
  }
}
