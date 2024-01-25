import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { EntityBase } from "../../base/entityBase";
import { User } from "../../user/entity/user.entity";
import { Alert } from "../../alert/entity/alert.entity";
import { Site } from "../../site/entity/site.entity";
import { ActionType, AlertCriteriaTypes, AlertSeverity, AlertTypes } from "../../common/enums";
import { Sensor } from "../../sensor/entity/sensor.entity";
import { Area } from "../../area/entity/area.entity";
import { AlertRuleSensor } from "../../alert-rule-sensor/entity/alert-rule-sensor.entity";

@Entity({ name: "alert_rule" })
export class AlertRule extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({
    name: "type",
    type: "enum",
    enum: AlertTypes,
    default: AlertTypes.ASSET,
  })
  alertType: AlertTypes;

  @Column({
    name: "alert_severity",
    type: "enum",
    enum: AlertSeverity,
    default: AlertSeverity.Low,
  })
  alertSeverity: AlertSeverity;

  @Column({
    name: "alert_criteria",
    type: "enum",
    enum: AlertCriteriaTypes,
    default: AlertCriteriaTypes.INDOORBOUND,
  })
  alertCriteria: AlertCriteriaTypes;

  @Column({
    name: "action_type",
    type: "enum",
    enum: ActionType,
    array: true,
    default: [ActionType.CUSTOM],
  })
  actionType: ActionType[];

  @Column({ name: "recepients", type: "bytea" })
  recepients: string[];

  @Column({ name: "created_by", type: "varchar" })
  createdBy: string;

  @Column({ name: "description", type: "varchar" })
  description: string;

  @OneToMany(() => Alert, (alert) => alert.alertRule)
  alert: Alert;

  @ManyToOne(() => Site, (site) => site.alertRule)
  @JoinColumn({ name: "site_id", referencedColumnName: "id" })
  site: Site;

  @OneToMany(() => AlertRuleSensor, (alertRuleSensor) => alertRuleSensor.alertRule, { nullable: true })
  alertRuleSensor: AlertRuleSensor[];

  @ManyToOne(() => Area, (area) => area.alertRule, { nullable: true })
  @JoinColumn({ name: "area_id", referencedColumnName: "id" })
  area: Area;
}
