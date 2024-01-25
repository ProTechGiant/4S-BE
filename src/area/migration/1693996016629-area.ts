import { MigrationInterface, QueryRunner } from "typeorm";

export class area1693328620520 implements MigrationInterface {
  name = "area1693328620520";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."area_protocol_enum" AS ENUM('ble', 'wirepas', 'narrowband', 'lora')`);

    await queryRunner.query(
      `CREATE TABLE "area" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "a" character varying NOT NULL, "protocol" "public"."area_protocol_enum" NOT NULL, "r" character varying NOT NULL, "b" character varying NOT NULL, "g" character varying NOT NULL, "description" character varying, "coordinates" json NOT NULL, "site_id" uuid, CONSTRAINT "PK_39d5e4de490139d6535d75f42ff" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(`ALTER TABLE "area" ADD CONSTRAINT "FK_57c68651a03824054d795ae1305" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "area" DROP CONSTRAINT "FK_57c68651a03824054d795ae1305"`);
    await queryRunner.query(`DROP TABLE \`area\``);
    await queryRunner.query(`DROP TYPE "public"."area_protocol_enum"`);
  }
}
