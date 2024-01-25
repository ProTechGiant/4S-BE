import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { AlertRuleSensor } from "./entity/alert-rule-sensor.entity";
import { Sensor } from "../sensor/entity/sensor.entity";
import { SensorProtocolTypes } from "../sensor/enum/sensor.enum";

export class AlertRuleSensorRepository extends Repository<AlertRuleSensor> {
  public getSensorById(id: string | number, protocol?: SensorProtocolTypes): SelectQueryBuilder<AlertRuleSensor> {
    const query = getManager().getRepository(AlertRuleSensor).createQueryBuilder("alertRuleSensor").where("alertRuleSensor.sensor_id = :id", { id });
    // if (protocol) query.andWhere("sensor.protocol = :protocol", { protocol });
    return query;
  }
  public getAlertRuleSensorByAlertRuleAndSensorIdz(Idz: string[], alertRuleId?: string): SelectQueryBuilder<AlertRuleSensor> {
    return getManager()
      .getRepository(AlertRuleSensor)
      .createQueryBuilder("alertRuleSensor")
      .leftJoinAndSelect("alertRuleSensor.sensor", "sensor")
      .leftJoinAndSelect("alertRuleSensor.alertRule", "alertRule")
      .where("alertRuleSensor.alertRule = :alertRuleId AND alertRuleSensor.sensor IN (:...Idz)", { Idz, alertRuleId });
  }
}
