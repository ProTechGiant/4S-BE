import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeSoftRemove } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { Alert } from "../../alert/entity/alert.entity";
import { Personnel } from "../../personnel/entity/personnel.entity";
import { Asset } from "../../asset/entity/asset.entity";
import { UserRole } from "../../user-role/entity/user-role.entity";
import { AlertRule } from "../../alert-rule/entity/alert-rule.entity";
import { WirepasBuilding } from "../../wirepas/entity/wirepas-building.entity";
import { Sensor } from "../../sensor/entity/sensor.entity";
import { PersonnelService } from "../../personnel/personnel.service";
import { Area } from "../../area/entity/area.entity";
import { WirepasBuildingService } from "../../wirepas/wirepas-building.service";
import { AreaService } from "../../area/area.service";
import { AlertRuleService } from "../../alert-rule/alert-rule.service";
import { AssetService } from "../../asset/asset.service";

@Entity({ name: "site" })
export class Site extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "name", type: "varchar" })
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.site)
  userRole: UserRole[];

  @OneToMany(() => Asset, (asset) => asset.site)
  asset: Asset[];

  @OneToMany(() => WirepasBuilding, (wirepasBuilding) => wirepasBuilding.site)
  wirepasBuilding: WirepasBuilding[];

  @OneToMany(() => Area, (area) => area.site)
  area: Area[];

  @OneToMany(() => Sensor, (sensor) => sensor.site)
  sensor: Sensor[];

  @OneToMany(() => Alert, (alert) => alert.site)
  alert: Alert[];

  @OneToMany(() => Personnel, (personnel) => personnel.site)
  personnel: Personnel[];

  @OneToMany(() => AlertRule, (alertRule) => alertRule.site)
  alertRule: AlertRule[];

  @BeforeSoftRemove()
  async beforeRemove() {
    const wirepasBuildingService = new WirepasBuildingService();
    const alertRuleService = new AlertRuleService();
    const areaService = new AreaService();
    const assetService = new AssetService();
    const personnelService = new PersonnelService();
    await personnelService.unlinkPersonnel({ site: this.id }, this.transactionScope);
    await areaService.deleteArea({ site: this.id }, this.currentUser, this.transactionScope);
    await wirepasBuildingService.deleteWirepasBuilding({ site: this.id }, this.currentUser, this.transactionScope);
    await alertRuleService.unlinkAlertRule({ site: this.id }, this.transactionScope);
    await assetService.deleteAsset({ site: this.id }, this.transactionScope);
  }
}
