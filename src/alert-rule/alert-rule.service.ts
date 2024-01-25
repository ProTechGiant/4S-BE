import { BaseService } from "../base/base.service";
import { InValidCredentials, NoRecordFoundException } from "../errors/exceptions";
import { SiteService } from "../site/site.service";
import { CommonDTOs } from "../common/dto";
import { AlertsRuleDtos } from "./dto/alert-rule.dto";
import { AlertRule } from "./entity/alert-rule.entity";
import { AlertRuleRepository } from "./alert-rule-repository";
import { TransactionScope } from "../base/transactionScope";
import { Sensor } from "../sensor/entity/sensor.entity";
import { Site } from "../site/entity/site.entity";
import { AreaService } from "../area/area.service";
import { Area } from "../area/entity/area.entity";
import { AlertRuleSensorService } from "../alert-rule-sensor/alert-rule-sensor.service";
import { SensorService } from "../sensor/sensor.service";
import { AlertRuleSensor } from "../alert-rule-sensor/entity/alert-rule-sensor.entity";
import { UserService } from "../user/user.service";

export class AlertRuleService extends BaseService {
  private readonly siteService: SiteService;
  private readonly areaService: AreaService;
  private readonly alertRuleSensorService: AlertRuleSensorService;
  private readonly alertRuleRepository: AlertRuleRepository;
  private readonly sensorService: SensorService;
  private readonly userService: UserService;

  constructor() {
    super();
    this.siteService = new SiteService();
    this.alertRuleSensorService = new AlertRuleSensorService();
    this.alertRuleRepository = new AlertRuleRepository();
    this.areaService = new AreaService();
    this.sensorService = new SensorService();
    this.userService = new UserService();
  }

  async createAlertRule(input: AlertsRuleDtos.CreateAlertRuleInput, currentUser: CommonDTOs.CurrentUser): Promise<AlertRule> {
    try {
      const alertRule = new AlertRule();
      let area: Area;
      const transactionScope = this.getTransactionScope();
      const site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");

      const sensorArray = await this.alertRuleSensorService.assignSensorToAlertRule(input.sensorIdz, alertRule);
      if (input.areaId) {
        [area] = await this.areaService.getArea({ id: input.areaId });
        if (!area) throw new NoRecordFoundException("Invalid area specified");
        alertRule.area = area;
      }

      alertRule.actionType = Array.isArray(input.actionType) ? input.actionType : [input.actionType];
      alertRule.alertType = input.alertType;
      alertRule.alertSeverity = input.alertSeverity;
      alertRule.alertCriteria = input.alertCriteria;
      alertRule.createdBy = currentUser.email;
      alertRule.description = input.description;
      alertRule.recepients = input.recepients;
      alertRule.alertRuleSensor = sensorArray;

      alertRule.site = site;

      transactionScope.add(alertRule);
      if (sensorArray.length) {
        transactionScope.addCollection(alertRule.alertRuleSensor);
      }
      await transactionScope.commit();
      return alertRule;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAlertRule(params: CommonDTOs.FilterParam): Promise<AlertRule[]> {
    try {
      return this.alertRuleRepository.getAlertRuleWithJoins(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async unlinkAlertRule(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<AlertRule[]> {
    const transactionScope = tScope ?? this.getTransactionScope();

    const alertRules = await this.getAlertRule(params);

    for (const alertRule of alertRules) {
      if (params.site) alertRule.site = null;
      // else if (params.sensor) alertRule.sensor = null;
      else if (params.area) alertRule.area = null;
    }

    transactionScope.updateCollection(alertRules);
    return alertRules;
  }

  async updateAlertRule(input: AlertsRuleDtos.UpdateAlertRuleInput, params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser): Promise<AlertRule> {
    try {
      let alertRuleSensor: AlertRuleSensor[];
      let site: Site;
      let area: Area;

      const transactionScope = this.getTransactionScope();
      const [alertRule] = await this.getAlertRule(params);
      if (!alertRule) throw new NoRecordFoundException("Invalid alertRule specified");

      if (input.siteId) {
        site = await this.siteService.getSiteById(input.siteId);
        if (!site) throw new NoRecordFoundException("Invalid site specified");
      }

      if (input.areaId) {
        [area] = await this.areaService.getArea({ id: input.areaId });
        if (!area) throw new NoRecordFoundException("Invalid area specified");
      }

      if (input.sensorIdz) {
        alertRuleSensor = await this.alertRuleSensorService.reAssignSensorToAlertRule(input.sensorIdz, alertRule, transactionScope);
      }

      if (input.alertType) alertRule.alertType = input.alertType;
      if (input.actionType) alertRule.actionType = Array.isArray(input.actionType) ? input.actionType : [input.actionType];
      if (input.alertSeverity) alertRule.alertSeverity = input.alertSeverity;
      if (input.alertCriteria) alertRule.alertCriteria = input.alertCriteria;
      if (input.createdBy) alertRule.createdBy = currentUser.email;
      if (input.description) alertRule.description = input.description;
      if (input.recepients) alertRule.recepients = input.recepients;
      if (input.sensorIdz) alertRule.alertRuleSensor = alertRuleSensor;
      if (input.siteId) alertRule.site = site;
      if (input.areaId) alertRule.area = area;

      transactionScope.update(alertRule);
      transactionScope.updateCollection(alertRule.alertRuleSensor);
      await transactionScope.commit();
      delete alertRule.alertRuleSensor;
      return alertRule;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAlertRuleById(params: CommonDTOs.FilterParam): Promise<AlertRule> {
    try {
      const [alertRule] = await this.getAlertRule(params);
      if (!alertRule) throw new NoRecordFoundException("Invalid alertRule specified");

      return alertRule;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAlertRule(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const alertRule = await this.getAlertRule(params);

      if (!tScope) {
        if (!alertRule) throw new NoRecordFoundException("Invalid alertRule specified");
        await transactionScope.commit();
        transactionScope.delete(alertRule[0]);
      } else {
        transactionScope.deleteCollection(alertRule);
      }
      return { message: "Alert Rule deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }
}
