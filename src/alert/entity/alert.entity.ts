import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { Site } from "../../site/entity/site.entity";
import { Asset } from "../../asset/entity/asset.entity";
import { Personnel } from "../../personnel/entity/personnel.entity";
import { AlertRule } from "../../alert-rule/entity/alert-rule.entity";
import { Sensor } from "../../sensor/entity/sensor.entity";
import { AlertStatusTypes } from "../enum/alert.enum";

@Entity({ name: "alert" })
export class Alert extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ name: "status", type: "enum", enum: AlertStatusTypes })
  status: AlertStatusTypes;

  @OneToOne(() => Personnel, (personnel) => personnel.alert)
  @JoinColumn({ name: "personnel_id", referencedColumnName: "id" })
  personnel: Personnel;

  @ManyToOne(() => Site, (site) => site.alert)
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;

  @Column({ name: "resolved_by", type: "uuid", nullable: true })
  resolvedBy: string;

  @ManyToOne(() => AlertRule, (alertRule) => alertRule.alert, {
    nullable: true,
  })
  @JoinColumn({ name: "alert_rule_id", referencedColumnName: "id" })
  alertRule: AlertRule;

  @ManyToOne(() => Asset, (asset) => asset.alert)
  @JoinColumn({ name: "asset_id", referencedColumnName: "id" })
  asset: Asset;

  @ManyToOne(() => Sensor, (sensor) => sensor.alert)
  @JoinColumn({ name: "sensor_id", referencedColumnName: "id" })
  sensor: Sensor;
}
