import { MigrationInterface, QueryRunner } from "typeorm";

export class personnel1693328457820 implements MigrationInterface {
  name = "personnel1693328457820";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "personnel" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "emergency_contact" character varying NOT NULL, "userId" character varying, "site_id" uuid, CONSTRAINT "PK_33a7253a5d2a326fec3cdc0baa5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "personnel" ADD CONSTRAINT "FK_ed628a3ba85c11a6591afbce02a" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "personnel" DROP CONSTRAINT "FK_ed628a3ba85c11a6591afbce02a"`);

    await queryRunner.query(`DROP TABLE "personnel"`);
  }
}
