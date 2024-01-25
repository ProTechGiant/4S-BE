import { MigrationInterface, QueryRunner } from "typeorm";

export class narrowbandArea1694692356715 implements MigrationInterface {
  name = "narrowbandArea1694692356715";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "narrowband_area" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "area_id" uuid, CONSTRAINT "REL_2d45444cf47bcb34b4c6dea55e" UNIQUE ("area_id"), CONSTRAINT "PK_b2f164bd7db1f09bef295b740ac" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "narrowband_area" ADD CONSTRAINT "FK_2d45444cf47bcb34b4c6dea55ee" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "narrowband_area" DROP CONSTRAINT "FK_2d45444cf47bcb34b4c6dea55ee"`);

    await queryRunner.query(`DROP TABLE "narrowband_area"`);
  }
}
