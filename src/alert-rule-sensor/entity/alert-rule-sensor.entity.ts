import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { EntityBase } from "../../base/entityBase";
import { AlertRule } from "../../alert-rule/entity/alert-rule.entity";
import { Sensor } from "../../sensor/entity/sensor.entity";

@Entity({ name: "alert_rule_sensor" })
export class AlertRuleSensor extends EntityBase {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @ManyToOne(() => AlertRule)
  @JoinColumn({ name: "alert_rule_id", referencedColumnName: "id" })
  alertRule: AlertRule;

  @ManyToOne(() => Sensor)
  @JoinColumn({ name: "sensor_id", referencedColumnName: "id" })
  sensor: Sensor;
}
