import { EntityBase } from "../../base/entityBase";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, BeforeSoftRemove } from "typeorm";

import { Site } from "../../site/entity/site.entity";
import { WirepasArea } from "../../wirepas/entity/wirepas-area.entity";
import { SensorProtocolTypes } from "../../sensor/enum/sensor.enum";
import { NarrowbandArea } from "../../narrowband/entity/narrowband-area.entity";
import { AlertRule } from "../../alert-rule/entity/alert-rule.entity";
import { AlertRuleService } from "../../alert-rule/alert-rule.service";
import { CoordinatesPoints } from "../../common/interfaces/point.interface";

@Entity({ name: "area" })
export class Area extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @ManyToOne(() => Site, (site: Site) => site.area)
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;

  @OneToOne(() => WirepasArea, (wirepasArea: WirepasArea) => wirepasArea.area)
  wirepasArea: WirepasArea;

  @OneToOne(() => NarrowbandArea, (narrowbandArea: NarrowbandArea) => narrowbandArea.area)
  narrowbandArea: NarrowbandArea;

  @Column({ name: "a", type: "varchar" })
  a: string;

  @Column({ name: "protocol", type: "enum", enum: SensorProtocolTypes })
  protocol: SensorProtocolTypes;

  @Column({ name: "r", type: "varchar" })
  r: string;

  @Column({ name: "b", type: "varchar" })
  b: string;

  @Column({ name: "g", type: "varchar" })
  g: string;

  @Column({ name: "description", type: "varchar", nullable: true })
  description: string;

  @Column("json", { name: "coordinates" })
  coordinates: Array<CoordinatesPoints>;

  @OneToMany(() => AlertRule, (alertRule) => alertRule.area)
  alertRule: AlertRule;

  @BeforeSoftRemove()
  async beforeSoftRemove(): Promise<void> {
    const alertRuleService = new AlertRuleService();
    await alertRuleService.unlinkAlertRule({ area: this.id }, this.transactionScope);
  }
}
