import { MigrationInterface, QueryRunner } from "typeorm";

export class user1693328505356 implements MigrationInterface {
  name = "user1693328505356";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying , "last_name" character varying , "email" character varying NOT NULL, "phone_number" character varying , "password" character varying , "is_active" boolean NOT NULL DEFAULT false, "phone_number_verification" boolean NOT NULL DEFAULT false, "is_super_admin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
