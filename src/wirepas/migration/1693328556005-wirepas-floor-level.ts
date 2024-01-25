import { MigrationInterface, QueryRunner } from "typeorm";

export class wirepasFloorlevel1693328457699 implements MigrationInterface {
  name = "wirepasFloorlevel1693328457699";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wirepas_floorlevel" ("created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gateway_network_address" character varying, "name" character varying NOT NULL, "level" integer NOT NULL, "floorplan_image" bytea, "floorplan_image_id" character varying, "floorplan_image_url" character varying, "asset_count" integer NOT NULL, "sensor_count" integer NOT NULL, "image_width" numeric(11,8), "image_height" numeric(11,8), "altitude_leftbottom" numeric(11,8), "altitude_lefttop" numeric(11,8), "altitude_rightbottom" numeric(11,8), "altitude_righttop" numeric(11,8), "distance_in_m" numeric(11,8), "latitude_leftbottom" numeric(11,8), "latitude_lefttop" numeric(11,8), "latitude_rightbottom" numeric(11,8), "latitude_righttop" numeric(11,8), "longitude_leftbottom" numeric(11,8), "longitude_lefttop" numeric(11,8), "longitude_rightbottom" numeric(11,8), "longitude_righttop" numeric(11,8), "x_distance_point1" double precision NOT NULL, "x_distance_point2" double precision NOT NULL, "x_normcoord_leftbottom" numeric(11,8) NOT NULL DEFAULT '0', "x_normcoord_lefttop" numeric(11,8) NOT NULL DEFAULT '0', "x_normcoord_righttop" numeric(11,8) NOT NULL DEFAULT '1', "x_normcoord_rightbottom" numeric(11,8) NOT NULL DEFAULT '1', "y_distance_point1" double precision NOT NULL DEFAULT '0', "y_distance_point2" double precision NOT NULL DEFAULT '0', "y_normcoord_leftbottom" numeric(11,8) NOT NULL DEFAULT '1', "y_normcoord_lefttop" numeric(11,8) NOT NULL DEFAULT '0', "y_normcoord_rightbottom" numeric(11,8) NOT NULL DEFAULT '1', "y_normcoord_righttop" numeric(11,8) NOT NULL DEFAULT '0', "wirepas_building_id" character varying, CONSTRAINT "PK_12183d683b548bb731b8c4cd3a6" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(`ALTER TABLE "wirepas_floorlevel" ADD CONSTRAINT "FK_76f1151e00ac265ed3b6bbd926d" FOREIGN KEY ("wirepas_building_id") REFERENCES "wirepas_building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wirepas_floorlevel" DROP CONSTRAINT "FK_76f1151e00ac265ed3b6bbd926d"`);

    await queryRunner.query(`DROP TABLE "wirepas_floorlevel"`);
  }
}
