import { MigrationInterface, QueryRunner } from "typeorm";

export class narrowbandSensor1701777204566 implements MigrationInterface {
  name = "narrowbandSensor1701777204566";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "narrowband_sensor" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" character varying NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "location_priority" character varying NOT NULL DEFAULT '1,2', "sos_status" boolean NOT NULL DEFAULT '1', "location_interval" character varying NOT NULL DEFAULT '1@00002400', "sensor_id" character varying, CONSTRAINT "REL_b08d8974ee5ad5082fe861b659" UNIQUE ("sensor_id"), CONSTRAINT "PK_da3c356b403e71f7a5dd287bdf6" PRIMARY KEY ("id", "uuid"))`
    );
    await queryRunner.query(`ALTER TABLE "narrowband_sensor" ADD CONSTRAINT "FK_b08d8974ee5ad5082fe861b659f" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "narrowband_sensor" DROP CONSTRAINT "FK_b08d8974ee5ad5082fe861b659f"`);
    await queryRunner.query(`DROP TABLE "narrowband_sensor"`);
  }
}
