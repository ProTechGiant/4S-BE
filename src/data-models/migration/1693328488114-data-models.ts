import { MigrationInterface, QueryRunner } from "typeorm";

export class dataModels1693328488114 implements MigrationInterface {
  name = "dataModels1693328488114";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "data_models" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "table_name" character varying NOT NULL, "entity_name" character varying NOT NULL, "friendly_name" character varying NOT NULL, "description" character varying, "column_meta_data" json NOT NULL, "is_internal_table" boolean NOT NULL DEFAULT true, "roles_meta_data" json, CONSTRAINT "UQ_001b0ef48057ada8a6504590bf3" UNIQUE ("table_name"), CONSTRAINT "UQ_861754dd501d8559357ab280c58" UNIQUE ("entity_name"), CONSTRAINT "PK_0a049efb6c96d9c0eddf8f1ac6a" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`data_models\``);
  }
}
