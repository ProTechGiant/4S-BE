import { MigrationInterface, QueryRunner } from "typeorm";

export class narrowbandLocationData1701777367448 implements MigrationInterface {
  name = "narrowbandLocationData1701777367448";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "narrowband-location-data" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "time_stamp" integer NOT NULL, "battery" integer, "latitude" numeric(10,8) NOT NULL, "longitude" numeric(11,8) NOT NULL, "wifi" character varying, "cumulative_steps" integer, "network_info_strength" integer, "alarm" integer, "narrowband_sensor_id" character varying NOT NULL, CONSTRAINT "PK_0a335617f0df074ca963e445c8d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`
  ALTER TABLE "narrowband_sensor" ADD CONSTRAINT "UQ_narrowband_sensor_id" UNIQUE ("id");
  ALTER TABLE "narrowband-location-data"
  ADD CONSTRAINT "FK_edfe0da7ffb65c1e4b519169c69"
  FOREIGN KEY ("narrowband_sensor_id")
  REFERENCES "narrowband_sensor"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "narrowband-location-data" DROP CONSTRAINT "FK_edfe0da7ffb65c1e4b519169c69"`);
    await queryRunner.query(`DROP TABLE "narrowband-location-data"`);
  }
}
