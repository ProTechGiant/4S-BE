import { AlertRule } from "../alert-rule/entity/alert-rule.entity";
import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { Sensor } from "../sensor/entity/sensor.entity";
import { SensorService } from "../sensor/sensor.service";
import { User } from "../user/entity/user.entity";
import { AlertRuleSensorRepository } from "./alert-rule-sensor.repository";
import { AlertRuleSensor } from "./entity/alert-rule-sensor.entity";

export class AlertRuleSensorService extends BaseService {
  private readonly alertRuleSensorRepository: AlertRuleSensorRepository;
  private readonly sensorService: SensorService;
  constructor() {
    super();
    this.alertRuleSensorRepository = new AlertRuleSensorRepository();
    this.sensorService = new SensorService();
  }
  async getSensorById(sensorId: string): Promise<Sensor> {
    return this.sensorService.getSensorById(sensorId);
  }
  async getSensorByIdz(sensorIdz: string[]): Promise<Sensor[]> {
    return this.sensorService.getSensorByIdz(sensorIdz);
  }

  async assignSensorToAlertRule(sensorIdz: string[], alertRule: AlertRule, transactionScope?: TransactionScope): Promise<AlertRuleSensor[]> {
    const sensors = await this.sensorService.getSensorByIdz(sensorIdz);

    const alertRuleSensorArray = sensors.map((sensor) => {
      const alertRuleSensor = new AlertRuleSensor();
      alertRuleSensor.sensor = sensor;
      alertRuleSensor.alertRule = alertRule;
      return alertRuleSensor;
    });

    if (transactionScope) {
      transactionScope.addCollection(alertRuleSensorArray);
    }

    return alertRuleSensorArray;
  }

  async reAssignSensorToAlertRule(sensorIdz: string[], alertRule: AlertRule, transactionScope?: TransactionScope): Promise<AlertRuleSensor[]> {
    const sensors = await this.assignSensorToAlertRule(sensorIdz, alertRule, transactionScope);
    const previousSensor = await this.alertRuleSensorRepository.getAlertRuleSensorByAlertRuleAndSensorIdz(sensorIdz, alertRule.id).getMany();
    if (transactionScope) {
      transactionScope.deleteCollection(previousSensor);
    }

    return sensors;
  }
}
