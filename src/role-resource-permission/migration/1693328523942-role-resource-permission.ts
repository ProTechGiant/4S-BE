import { MigrationInterface, QueryRunner } from "typeorm";

export class roleResourcePermission1693328523942 implements MigrationInterface {
  name = "roleResourcePermission1693328523942";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_resource_permission" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "can_write" boolean, "can_read" boolean, "can_update" boolean, "can_delete" boolean, "role_id" uuid NOT NULL, "resource_id" uuid NOT NULL, CONSTRAINT "PK_3bcafbf49ba27b4afcb1467ea5c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "role_resource_permission" ADD CONSTRAINT "FK_3d1d929368cc4c5dbec27bb7253" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role_resource_permission" ADD CONSTRAINT "FK_a60a7588315fce33c2aaf778e8c" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role_resource_permission" DROP CONSTRAINT "FK_a60a7588315fce33c2aaf778e8c"`);
    await queryRunner.query(`ALTER TABLE "role_resource_permission" DROP CONSTRAINT "FK_3d1d929368cc4c5dbec27bb7253"`);
    await queryRunner.query(`DROP TABLE "role_resource_permission"`);
  }
}
