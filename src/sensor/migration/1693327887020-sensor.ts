import { MigrationInterface, QueryRunner } from "typeorm";

export class sensor1701764031515 implements MigrationInterface {
  name = "sensor1701764031515";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."sensor_protocol_enum" AS ENUM('ble', 'wirepas', 'narrowband', 'lora')`);

    await queryRunner.query(
      `CREATE TABLE "sensor" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" character varying NOT NULL ,"uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "sub_type" character varying, "protocol" "public"."sensor_protocol_enum" NOT NULL, "site_id" uuid, "personnel_id" uuid, "asset_id" uuid, CONSTRAINT "PK_ccc38b9aa8b3e198b6503d5eee9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_1c8cd3af0efc9003361df0f13a7" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_481c0d28c7e2962260e885c1ac2" FOREIGN KEY ("personnel_id") REFERENCES "personnel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_a25c1fd890bf26ed0132d6e65bb" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE "public"."sensor_protocol_enum"`);
    await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_a25c1fd890bf26ed0132d6e65bb"`);
    await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_481c0d28c7e2962260e885c1ac2"`);
    await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_1c8cd3af0efc9003361df0f13a7"`);
    await queryRunner.query(`DROP TABLE "sensor"`);
  }
}
