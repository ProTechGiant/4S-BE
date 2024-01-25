import { MigrationInterface, QueryRunner } from "typeorm";

export class siteTransection1693328532728 implements MigrationInterface {
  name = "siteTransection1693328532728";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "site_transaction" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sql_query" character varying NOT NULL, CONSTRAINT "PK_dd3d220a722c3f836f615e02106" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "site_transaction"`);
  }
}
