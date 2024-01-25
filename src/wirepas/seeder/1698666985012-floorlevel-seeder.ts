import { MigrationInterface, QueryRunner } from "typeorm";
import { WirepasBuildingService } from "../wirepas-building.service";
import { BaseService } from "../../base/base.service";
import { WntAuthenticationInput } from "../../sockets/interface/wnt-gateway.interface";
import { WirepasFloorlevelService } from "../wirepas-floorlevel.service";
import { WirepasFloorlevel } from "../entity/wirepass-floorlevel.entity";
import fs from "fs";
import path from "path";
import { SiteService } from "../../site/site.service";
import { ImageTypes } from "../../common/constants";
export class FloorlevelSeeder1698666955012 extends BaseService implements MigrationInterface {
  private readonly wirepasFloorlevelService: WirepasFloorlevelService;
  private readonly wirepasBuildingService: WirepasBuildingService;
  private readonly siteService: SiteService;

  constructor() {
    super();
    this.wirepasFloorlevelService = new WirepasFloorlevelService();
    this.wirepasBuildingService = new WirepasBuildingService();
    this.siteService = new SiteService();
  }
  public async up(): Promise<void> {
    try {
      const wirepasFloorlevels: WirepasFloorlevel[] = [];
      const transactionScope = this.getTransactionScope();

      const wntUserInput: WntAuthenticationInput = {
        email: process.env.WNT_ATH_USERNAME,
        password: process.env.WNT_ATH_PASSWORD,
      };

      const site = await this.siteService.getFirstSite();
      const wirepasBuildings = await this.wirepasBuildingService.getBuilding({ site: site.id });

      const port = process.env.PORT;

      for (let wirepasBuilding of wirepasBuildings) {
        const wntFloorlevels = await this.wirepasFloorlevelService.getWntFloorlevelByBuildingId(wirepasBuilding.id, wntUserInput);
        for (const floorlevel of wntFloorlevels.floor_plans) {
          console.log("wirepasFloorlevels", floorlevel);

          const wirepasFloorlevel = new WirepasFloorlevel();
          const imageTypeMatch = getImageTypeMatch(floorlevel.image_id);

          wirepasFloorlevel.name = floorlevel.name;
          wirepasFloorlevel.level = floorlevel.level;
          wirepasFloorlevel.wirepasBuilding = wirepasBuilding;
          wirepasFloorlevel.assetCount = 0;
          wirepasFloorlevel.sensorCount = 0;
          wirepasFloorlevel.id = floorlevel.id;
          wirepasFloorlevel.gatewayNetworkAddress = floorlevel.id;
          wirepasFloorlevel.altitudeLeftbottom = floorlevel.altitude_leftbottom;
          wirepasFloorlevel.altitudeLefttop = floorlevel.altitude_righttop;
          wirepasFloorlevel.altitudeRightbottom = floorlevel.altitude_rightbottom;
          wirepasFloorlevel.altitudeRighttop = floorlevel.altitude_righttop;
          wirepasFloorlevel.distanceInM = floorlevel.distance_in_m;
          wirepasFloorlevel.latitudeLeftbottom = floorlevel.latitude_leftbottom;
          wirepasFloorlevel.latitudeLefttop = floorlevel.latitude_lefttop;
          wirepasFloorlevel.latitudeRightbottom = floorlevel.latitude_rightbottom;
          wirepasFloorlevel.latitudeRighttop = floorlevel.latitude_righttop;
          wirepasFloorlevel.longitudeLeftbottom = floorlevel.longitude_leftbottom;
          wirepasFloorlevel.longitudeLefttop = floorlevel.longitude_lefttop;
          wirepasFloorlevel.longitudeRightbottom = floorlevel.longitude_rightbottom;
          wirepasFloorlevel.longitudeRighttop = floorlevel.longitude_righttop;
          wirepasFloorlevel.xDistancePoint1 = floorlevel.x_distance_point1;
          wirepasFloorlevel.xDistancePoint2 = floorlevel.x_distance_point2;
          wirepasFloorlevel.xNormcoordLeftbottom = floorlevel.x_normcoord_leftbottom;
          wirepasFloorlevel.xNormcoordLefttop = floorlevel.x_normcoord_lefttop;
          wirepasFloorlevel.xNormcoordRighttop = floorlevel.x_normcoord_righttop;
          wirepasFloorlevel.xNormcoordRightbottom = floorlevel.x_normcoord_rightbottom;
          wirepasFloorlevel.yDistancePoint1 = floorlevel.y_distance_point1;
          wirepasFloorlevel.yDistancePoint2 = floorlevel.y_distance_point2;
          wirepasFloorlevel.yNormcoordLeftbottom = floorlevel.y_normcoord_leftbottom;
          wirepasFloorlevel.yNormcoordLefttop = floorlevel.y_normcoord_lefttop;
          wirepasFloorlevel.yNormcoordRightbottom = floorlevel.y_normcoord_rightbottom;
          wirepasFloorlevel.yNormcoordRighttop = floorlevel.y_normcoord_righttop;
          wirepasFloorlevel.floorplanImageId = floorlevel.image_id;
          wirepasFloorlevel.floorplanImageUrl = `http://127.0.0.1:${port}/floorlevel/${floorlevel.image_id}.${imageTypeMatch}`;
          wirepasFloorlevels.push(wirepasFloorlevel);
        }
      }

      transactionScope.bulkInsert(wirepasFloorlevels);
      await transactionScope.commit();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM building`);
  }
}

function getImageTypeMatch(imageId: string) {
  for (const ImageType of ImageTypes) {
    const imagePath = path.join(__dirname, "../../images", `${imageId}.${ImageType}`);
    if (fs.existsSync(imagePath)) {
      return ImageType;
    }
  }
  return "jpg";
}
