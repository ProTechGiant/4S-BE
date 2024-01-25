import { MigrationInterface, QueryRunner } from "typeorm";

export class WirepasDataMigration1701776487969 implements MigrationInterface {
  name = "WirepasDataMigration1701776487969";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the wirepas_data table
    await queryRunner.query(
      `CREATE TABLE "wirepas_data" (
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "is_approved" boolean NOT NULL DEFAULT false,
        "online_status_string" integer NOT NULL,
        "voltage" integer NOT NULL,
        "latitude" numeric(11,8) NOT NULL,
        "longitude" numeric(11,8) NOT NULL,
        "altitude" numeric(11,8) NOT NULL,
        "position_pixel_x" integer NOT NULL,
        "position_pixel_y" integer NOT NULL,
        "position_meter_x" character varying NOT NULL,
        "position_meter_y" character varying NOT NULL,
        "positioning_role_string" integer NOT NULL,
        "measurement_time" TIMESTAMP NOT NULL,
        "positioning_time" TIMESTAMP NOT NULL,
        "wirepas_building_id" uuid NOT NULL,
        "wirepas_building_name" character varying NOT NULL,
        "floor_plan_id" uuid NOT NULL,
        "floor_plan_name" character varying NOT NULL,
        "wire_pas_areas" text NOT NULL,
        "node_address" integer NOT NULL,
        "network_address" integer NOT NULL,
        "wirepas_sensor_id" integer NOT NULL,
        CONSTRAINT "PK_0192f43899b67d0253ad80deaed" PRIMARY KEY ("id")
      )`
    );

    await queryRunner.query(`ALTER TABLE "wirepas_sensor" ADD CONSTRAINT "UQ_wirepas_sensor_id" UNIQUE ("id")`);

    await queryRunner.query(
      `ALTER TABLE "wirepas_data" ADD CONSTRAINT "FK_5d2b5b040892e351fd98573d388"
      FOREIGN KEY ("wirepas_sensor_id") REFERENCES "wirepas_sensor"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wirepas_data" DROP CONSTRAINT "FK_5d2b5b040892e351fd98573d388"`);

    await queryRunner.query(`DROP TABLE "wirepas_data"`);

    await queryRunner.query(`ALTER TABLE "wirepas_sensor" DROP CONSTRAINT "UQ_wirepas_sensor_id"`);
  }
}
