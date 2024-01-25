import { Alert } from "../../alert/entity/alert.entity";
import { EntityBase } from "../../base/entityBase";
import { Site } from "../../site/entity/site.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, OneToMany, BeforeSoftRemove } from "typeorm";
import { WirepasBuilding } from "../../wirepas/entity/wirepas-building.entity";
import { AssetSensor } from "../../asset-sensor/entity/asset-sensor.entity";
import { WirepasFloorlevel } from "../../wirepas/entity/wirepass-floorlevel.entity";
import { AssetSensorService } from "../../asset-sensor/asset-sensor.service";
import { AlertService } from "../../alert/alert.service";
import { Sensor } from "../../sensor/entity/sensor.entity";

@Entity({ name: "asset" })
@Index("unique_asset", ["name", "model", "serialNumber"], { unique: true })
export class Asset extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "name", type: "varchar" })
  name: string;

  @Column({ name: "image", type: "bytea", nullable: true })
  image: Buffer;

  @Column({ name: "model", type: "varchar" })
  model: string;

  @Column({ name: "device_type", type: "varchar" })
  deviceType: string;

  @Column({ name: "serial_number", type: "varchar" })
  serialNumber: string;

  @Column({ name: "warranty_date", type: "date" })
  warrantyDate: Date;

  @Column({ name: "issue_date", type: "date" })
  issueDate: Date;

  @ManyToOne(() => Site, (site) => site.asset)
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;

  @ManyToOne(() => WirepasBuilding, (wirepasBuilding) => wirepasBuilding.assets)
  @JoinColumn({ name: "wirepas_building_id", referencedColumnName: "id" })
  wirepasBuilding: WirepasBuilding;

  @ManyToOne(() => WirepasFloorlevel, (wirepasFloorlevel) => wirepasFloorlevel.asset)
  @JoinColumn({ name: "wirepas_floorlevel_id", referencedColumnName: "id" })
  wirepasFloorlevel: WirepasFloorlevel;

  @OneToMany(() => Alert, (alert) => alert.asset)
  alert: Alert[];

  @OneToMany(() => AssetSensor, (assetSensor) => assetSensor.asset)
  assetSensor: AssetSensor[];

  @OneToMany(() => Sensor, (sensor) => sensor.asset)
  sensor: Sensor[];

  @BeforeSoftRemove()
  async beforeSoftRemove(): Promise<void> {
    const alertService = new AlertService();
    const assetSensorService = new AssetSensorService();
    await alertService.deleteAlert({ asset: this.id }, this.transactionScope);
    await assetSensorService.deleteAssetSensor({ asset: this.id }, this.transactionScope);
  }
}
