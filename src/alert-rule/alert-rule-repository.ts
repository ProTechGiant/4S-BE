import { Repository, SelectQueryBuilder, getManager } from "typeorm";
import { AlertRule } from "./entity/alert-rule.entity";
import { CommonDTOs } from "../common/dto";

export class AlertRuleRepository extends Repository<AlertRule> {
  public getAlertRuleWithJoins(params: CommonDTOs.FilterParam): SelectQueryBuilder<AlertRule> {
    return getManager()
      .getRepository(AlertRule)
      .createQueryBuilder("alertRule")
      .leftJoinAndSelect("alertRule.area", "area")
      .leftJoinAndSelect("alertRule.site", "site")
      .leftJoinAndSelect("alertRule.alertRuleSensor", "alertRuleSensor")
      .leftJoinAndSelect("alertRuleSensor.sensor", "sensor")
      .where({ ...params });
  }
  public getAlertRule(params: CommonDTOs.FilterParam): SelectQueryBuilder<AlertRule> {
    return getManager()
      .getRepository(AlertRule)
      .createQueryBuilder("alertRule")
      .leftJoinAndSelect("alertRule.area", "area")
      .where({ ...params });
  }
  public assignSensor(params: CommonDTOs.FilterParam): SelectQueryBuilder<AlertRule> {
    return getManager()
      .getRepository(AlertRule)
      .createQueryBuilder("alertRule")
      .leftJoinAndSelect("alertRule.area", "area")
      .where({ ...params });
  }
}
