import { MigrationInterface, QueryRunner } from "typeorm";

export class wirepasBuilding1693327887020 implements MigrationInterface {
  name = "wirepasBuilding1693327887020";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wirepas_building" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" character varying NOT NULL, "name" character varying NOT NULL, "latitude" numeric(11,2) NOT NULL, "longitude" numeric(11,2) NOT NULL, "location" character varying NOT NULL, "street_address" character varying NOT NULL, "asset_count" integer NOT NULL, "site_id" uuid, CONSTRAINT "PK_5b6da74f8ad3b6de3e7f5a9d2c2" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(`ALTER TABLE "wirepas_building" ADD CONSTRAINT "FK_000ee2628f30403f9e7afafcdd8" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
