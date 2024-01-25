import { MigrationInterface, QueryRunner } from "typeorm";

export class resetPasswordToken1693328505456 implements MigrationInterface {
  name = "resetPasswordToken1693328505456";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reset_password_token" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password_token" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_4ec784f3b60e7ea2cafad470cc" UNIQUE ("user_id"), CONSTRAINT "PK_c6f6eb8f5c88ac0233eceb8d385" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "reset_password_token" ADD CONSTRAINT "FK_4ec784f3b60e7ea2cafad470cc7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reset_password_token" DROP CONSTRAINT "FK_4ec784f3b60e7ea2cafad470cc7"`);
    await queryRunner.query(`DROP TABLE "reset_password_token"`);
  }
}
