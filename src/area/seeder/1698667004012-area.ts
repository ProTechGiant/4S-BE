import { MigrationInterface, QueryRunner } from "typeorm";
import { WirepasFloorlevelService } from "../../wirepas/wirepas-floorlevel.service";
import { BaseService } from "../../base/base.service";
import { WirepasAreaService } from "../../wirepas/wirepas-area.service";
import { SiteService } from "../../site/site.service";
import { WntAuthenticationInput } from "../../sockets/interface/wnt-gateway.interface";
import { Area } from "../../area/entity/area.entity";
import { SensorProtocolTypes } from "../../sensor/enum/sensor.enum";
import { WirepasArea } from "../../wirepas/entity/wirepas-area.entity";

export class Area1698667004012 extends BaseService implements MigrationInterface {
  private readonly wirepasFloorlevelService: WirepasFloorlevelService;
  private readonly wirepasAreaService: WirepasAreaService;
  private readonly siteSerice: SiteService;

  constructor() {
    super();
    this.wirepasFloorlevelService = new WirepasFloorlevelService();
    this.wirepasAreaService = new WirepasAreaService();
    this.siteSerice = new SiteService();
  }
  public async up(): Promise<void> {
    try {
      const areas: Area[] = [];
      const wirepasAreas: WirepasArea[] = [];
      const transactionScope = this.getTransactionScope();

      const wntUserInput: WntAuthenticationInput = {
        email: process.env.WNT_ATH_USERNAME,
        password: process.env.WNT_ATH_PASSWORD,
      };

      const site = await this.siteSerice.getFirstSite();
      const wirepasFloorlevels = await this.wirepasFloorlevelService.getAllWirepasFloorlevel();
      for (const wirepasFloorlevel of wirepasFloorlevels) {
        const wntAreas = await this.wirepasAreaService.getWntAreaByFloorlevelId(wirepasFloorlevel.id, wntUserInput);

        for (const wntArea of wntAreas) {
          const area = new Area();

          area.id = wntArea.id;
          area.coordinates = wntArea.llas;
          area.a = wntArea.a;
          area.b = wntArea.b;
          area.r = wntArea.r;
          area.g = wntArea.g;
          area.site = site;
          area.protocol = SensorProtocolTypes.WIREPAS;
          areas.push(area);

          const wirepasArea = new WirepasArea();

          wirepasArea.id = area.id;
          wirepasArea.area = area;
          wirepasArea.wirepasFloorlevel = wirepasFloorlevel;
          wirepasAreas.push(wirepasArea);
        }
      }

      transactionScope.addCollection(areas);
      transactionScope.addCollection(wirepasAreas);
      await transactionScope.commit();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
