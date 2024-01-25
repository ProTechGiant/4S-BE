import { PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne, Entity, BeforeSoftRemove } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { SensorProtocolTypes, SensorTypes } from "../enum/sensor.enum";
import { Site } from "../../site/entity/site.entity";
import { Alert } from "../../alert/entity/alert.entity";
import { AlertRule } from "../../alert-rule/entity/alert-rule.entity";
import { AssetSensor } from "../../asset-sensor/entity/asset-sensor.entity";
import { WirepasSensor } from "../../wirepas/entity/wirepas-sensor.entity";
import { WirepasSensorService } from "../../wirepas/wirepas-sensor.service";
import { NarrowbandSensor } from "../../narrowband/entity/narrowband-sensor.entity";
import { AlertRuleService } from "../../alert-rule/alert-rule.service";
import { AssetSensorService } from "../../asset-sensor/asset-sensor.service";
import { NarrowbandSensorService } from "../../narrowband/narrowband-sensor.service";
import { Personnel } from "../../personnel/entity/personnel.entity";
import { Asset } from "../../asset/entity/asset.entity";
import { AlertRuleSensor } from "../../alert-rule-sensor/entity/alert-rule-sensor.entity";

@Entity({ name: "sensor" })
export class Sensor extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "uuid" })
  uuid: string;

  @Column({ name: "id", type: "varchar" })
  id: string;

  @Column({ name: "type", type: "varchar" })
  type: string;

  @Column({ name: "sub_type", type: "varchar", default: null })
  subType: string;

  @Column({ name: "protocol", type: "enum", enum: SensorProtocolTypes })
  protocol: SensorProtocolTypes;

  @ManyToOne(() => Site, (site) => site.sensor, { nullable: true })
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;

  @ManyToOne(() => Personnel, (personnel) => personnel.sensor)
  @JoinColumn({ name: "personnel_id", referencedColumnName: "id" })
  personnel: Personnel;

  @ManyToOne(() => Asset, (asset) => asset.sensor)
  @JoinColumn({ name: "asset_id", referencedColumnName: "id" })
  asset: Asset;

  @OneToMany(() => Alert, (alert) => alert.sensor)
  alert: Alert[];

  @OneToMany(() => AlertRuleSensor, (alertRuleSensor) => alertRuleSensor.sensor)
  alertRuleSensor: AlertRuleSensor[];

  @OneToMany(() => AssetSensor, (assetSensor) => assetSensor.sensor)
  assetSensor: AssetSensor[];

  @OneToOne(() => WirepasSensor, (wirepasSensor) => wirepasSensor.sensor, { nullable: true })
  wirepasSensor: WirepasSensor;

  @OneToOne(() => NarrowbandSensor, (narrowbandSensor) => narrowbandSensor.sensor)
  narrowbandSensor: NarrowbandSensor;

  @BeforeSoftRemove()
  async beforeSoftRemove(): Promise<void> {
    if (this.protocol === SensorProtocolTypes.WIREPAS) {
      const wirepasSensorService = new WirepasSensorService();
      await wirepasSensorService.deleteWirepasSensor({ sensor: this.id }, this.transactionScope);
    } else if (this.protocol === SensorProtocolTypes.NARROWBAND) {
      const narrowbandSensorService = new NarrowbandSensorService();
      await narrowbandSensorService.deleteNarrowbandSensor({ sensor: this.id }, this.transactionScope);
    }
    const alertRuleService = new AlertRuleService();
    const assetSensorService = new AssetSensorService();
    await alertRuleService.unlinkAlertRule({ site: this.id }, this.transactionScope);
    await assetSensorService.deleteAssetSensor({ site: this.id }, this.transactionScope);
  }
}
