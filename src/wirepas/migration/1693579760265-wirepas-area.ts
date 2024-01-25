import { MigrationInterface, QueryRunner } from "typeorm";

export class wirepasArea1693328620530 implements MigrationInterface {
  name = "wirepasArea1693328620530";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wirepas_area" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" character varying NOT NULL, "wirepas_floorlevel_id" uuid, "area_id" uuid, CONSTRAINT "REL_2de484c4b12372a95b108e3f10" UNIQUE ("area_id"), CONSTRAINT "PK_18ba5ed95d6cb897eb10f71d89c" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(`ALTER TABLE "wirepas_area" ADD CONSTRAINT "FK_1c39ff33b09c477471893ac33f2" FOREIGN KEY ("wirepas_floorlevel_id") REFERENCES "wirepas_floorlevel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "wirepas_area" ADD CONSTRAINT "FK_2de484c4b12372a95b108e3f10e" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wirepas_area" DROP CONSTRAINT "FK_2de484c4b12372a95b108e3f10e"`);
    await queryRunner.query(`ALTER TABLE "wirepas_area" DROP CONSTRAINT "FK_1c39ff33b09c477471893ac33f2"`);
    await queryRunner.query(`DROP TABLE "wirepas_area"`);
  }
}
