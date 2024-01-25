import { MigrationInterface, QueryRunner } from "typeorm";

export class WirepasSensor1701776486969 implements MigrationInterface {
  name = "wirepasSensor1701776486969";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wirepas_sensor" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" integer NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "wnt_gateway_id" integer NOT NULL, "wnt_gateway_name" character varying NOT NULL, "wirepas_floorlevel_id" uuid NOT NULL, "wirepas_building_id" character varying NOT NULL, "sensor_id" character varying, CONSTRAINT "REL_483f8cc084c04ae109c6d85a78" UNIQUE ("sensor_id"), CONSTRAINT "PK_36bdd3a158cd0d8234c18f4788e" PRIMARY KEY ("id", "uuid"))`
    );

    await queryRunner.query(`ALTER TABLE "wirepas_sensor" ADD CONSTRAINT "FK_7eb7550b016ee0beb4b6e682bd9" FOREIGN KEY ("wirepas_floorlevel_id") REFERENCES "wirepas_floorlevel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "wirepas_sensor" ADD CONSTRAINT "FK_7808d6288b0ed2040d13f6a6a0f" FOREIGN KEY ("wirepas_building_id") REFERENCES "wirepas_building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "wirepas_sensor" ADD CONSTRAINT "FK_483f8cc084c04ae109c6d85a780" FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wirepas_sensor" DROP CONSTRAINT "FK_483f8cc084c04ae109c6d85a780"`);
    await queryRunner.query(`ALTER TABLE "wirepas_sensor" DROP CONSTRAINT "FK_7808d6288b0ed2040d13f6a6a0f"`);
    await queryRunner.query(`ALTER TABLE "wirepas_sensor" DROP CONSTRAINT "FK_7eb7550b016ee0beb4b6e682bd9"`);
    await queryRunner.query(`DROP TABLE "wirepas_sensor"`);
  }
}
