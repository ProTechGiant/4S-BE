import { MigrationInterface, QueryRunner } from "typeorm";

export class asset1693328457739 implements MigrationInterface {
  name = "asset1693328457739";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "asset" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "image" bytea, "model" character varying NOT NULL, "device_type" character varying NOT NULL, "serial_number" character varying NOT NULL, "warranty_date" date NOT NULL, "issue_date" date NOT NULL, "site_id" uuid, "wirepas_building_id" character varying, "wirepas_floorlevel_id" uuid, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_7796818ec6d1e6714def42375eb" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_d7a41c6b1d002b8ab22c3d3da7b" FOREIGN KEY ("wirepas_building_id") REFERENCES "wirepas_building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_4d91519c3af3496fc21734c3383" FOREIGN KEY ("wirepas_floorlevel_id") REFERENCES "wirepas_floorlevel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_4d91519c3af3496fc21734c3383"`);
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_d7a41c6b1d002b8ab22c3d3da7b"`);
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_7796818ec6d1e6714def42375eb"`);
    await queryRunner.query(`DROP TABLE \`asset\``);
  }
}
