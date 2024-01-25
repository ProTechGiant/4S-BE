import { MigrationInterface, QueryRunner } from "typeorm";
import { WirepasBuildingService } from "../wirepas-building.service";
import { WirepasBuilding } from "../entity/wirepas-building.entity";
import { BaseService } from "../../base/base.service";
import { WntAuthenticationInput } from "../../sockets/interface/wnt-gateway.interface";
import { SiteService } from "../../site/site.service";
import { buildingDummy } from "../../common/constants";

export class WirepasSeeder1698666945012 extends BaseService implements MigrationInterface {
  private readonly wirepasBuildingService: WirepasBuildingService;
  private readonly siteSerice: SiteService;

  constructor() {
    super();
    this.wirepasBuildingService = new WirepasBuildingService();
    this.siteSerice = new SiteService();
  }
  public async up(): Promise<void> {
    try {
      const wirepasBuildings: WirepasBuilding[] = [];
      const transactionScope = this.getTransactionScope();

      const wntUserInput: WntAuthenticationInput = {
        email: process.env.WNT_ATH_USERNAME,
        password: process.env.WNT_ATH_PASSWORD,
      };

      const site = await this.siteSerice.getFirstSite();
      const wntBuildings = await this.wirepasBuildingService.getWntBuildings(wntUserInput);
      const buildingNames = wntBuildings.map((wntBuilding) => wntBuilding.name);
      const buildings = await this.wirepasBuildingService.getBuilding({ buildingNames });
      const filterWirepasBuildings = wntBuildings.filter((wntBuilding) => !buildings.some((wirepasBuilding) => wirepasBuilding.name === wntBuilding.name));

      for (let filterWirepasBuilding of filterWirepasBuildings) {
        const wirepasBuilding = new WirepasBuilding();
        const wirepasBuildingData = buildingDummy.find((building) => building.id === filterWirepasBuilding.id);
        wirepasBuilding.name = filterWirepasBuilding.name;
        wirepasBuilding.id = filterWirepasBuilding.id;
        wirepasBuilding.latitude = wirepasBuildingData.latitude;
        wirepasBuilding.longitude = wirepasBuildingData.longitude;
        wirepasBuilding.location = wirepasBuildingData.location;
        wirepasBuilding.streetAddress = wirepasBuildingData.streetAddress;
        wirepasBuilding.assetCount = wirepasBuildingData.assetCount;
        wirepasBuilding.site = site;
        wirepasBuildings.push(wirepasBuilding);
      }
      transactionScope.addCollection(wirepasBuildings);
      await transactionScope.commit();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM building`);
  }
}
