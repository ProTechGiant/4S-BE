import { BaseService } from "../base/base.service";
import { NoRecordFoundException, NotAcceptableException } from "../errors/exceptions";
import { SiteService } from "../site/site.service";
import { CommonDTOs } from "../common/dto";
import { SensorService } from "../sensor/sensor.service";
import { AlertDtos } from "./dto/alert.dto";
import { Alert } from "./entity/alert.entity";
import { AlertStatusTypes } from "./enum/alert.enum";
import { AlertRepository } from "./alert.repository";
import { AlertRuleService } from "../alert-rule/alert-rule.service";
import { PersonnelService } from "../personnel/personnel.service";
import { SensorProtocolTypes } from "../sensor/enum/sensor.enum";
import { AlertRule } from "../alert-rule/entity/alert-rule.entity";
import { AlertTypes } from "../common/enums";
import { TransactionScope } from "../base/transactionScope";
import { Personnel } from "../personnel/entity/personnel.entity";
import { isPointInsidePolygon } from "../common/utils/check-point-inside-area";
import { JsonToObject } from "../common/utils/json-to-object";

export class AlertService extends BaseService {
  private readonly siteService: SiteService;
  private readonly sensorService: SensorService;
  private readonly alertRepository: AlertRepository;
  private readonly alertRuleService: AlertRuleService;
  private readonly personelService: PersonnelService;

  constructor() {
    super();
    this.siteService = new SiteService();
    this.sensorService = new SensorService();
    this.alertRepository = new AlertRepository();
    this.alertRuleService = new AlertRuleService();
    this.personelService = new PersonnelService();
  }

  async alertHandler(alertHandlerInput: AlertDtos.AlertHandlerInput): Promise<void> {
    // note based on alert types we will get all the all alert rule.
    const alertRules = await this.alertRuleService.getAlertRule({
      sensor: alertHandlerInput.sensor.id,
      alertType: alertHandlerInput.alertType,
    });
    if (alertRules?.length) {
      switch (alertHandlerInput.sensor.protocol) {
        case SensorProtocolTypes.NARROWBAND:
          return await this.narrowbandAlertHandler(alertHandlerInput, alertRules);
        case SensorProtocolTypes.WIREPAS:
          return await this.wirepassAlertHandler(alertHandlerInput, alertRules);
        default:
          throw new NotAcceptableException("Sensor protocol not supported");
      }
    }
  }

  async narrowbandAlertHandler(alertHandlerInput: AlertDtos.AlertHandlerInput, alertRules: AlertRule[]): Promise<void> {
    try {
      if (alertHandlerInput.alertType === AlertTypes.MOVED_INSIDE_AREA || alertHandlerInput.alertType === AlertTypes.MOVED_OUTSIDE_AREA) {
        await this.narrowbandLocationAlert(alertHandlerInput, alertRules);
      } else {
        await this.narrowbandMeasurementAlert(alertHandlerInput, alertRules);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async narrowbandLocationAlert(alertHandlerInput: AlertDtos.AlertHandlerInput, alertRules: AlertRule[], tScope?: TransactionScope): Promise<void> {
    try {
      let alerts: Alert[];
      const transactionScope = tScope ?? this.getTransactionScope();
      for (const alertRule of alertRules) {
        // here we check either given given location data
        if (alertRule?.area?.coordinates && alertHandlerInput?.data?.currentLocation && alertHandlerInput?.data.previousLocation) {
          const isCurrLocationInside = isPointInsidePolygon(
            {
              ...alertHandlerInput.data.currentLocation,
            },
            {
              ...alertRule.area.coordinates,
            }
          );
          const isPreLocationInside = isPointInsidePolygon(
            {
              ...alertHandlerInput.data.previousLocation,
            },
            {
              ...alertRule.area.coordinates,
            }
          );
          // Alert will only be generated if previous and current have different position (Inside , Outside)
          if (isCurrLocationInside !== isPreLocationInside) {
            if ((alertHandlerInput.alertType === AlertTypes.MOVED_INSIDE_AREA && isCurrLocationInside) || (!isCurrLocationInside && alertHandlerInput.alertType === AlertTypes.MOVED_INSIDE_AREA)) {
              const alert = new Alert();
              alert.status = AlertStatusTypes.PENDING;
              alert.site = alertHandlerInput.sensor.site;
              alert.sensor = alertHandlerInput.sensor;
              alert.alertRule = alertRule;
              alert.resolvedBy = "none";
              alerts.push(alert);
            }
          }
        }
      }

      transactionScope.bulkInsert(alerts);
      if (!tScope) await transactionScope.commit();
    } catch (error) {
      throw new Error(error);
    }
  }

  async narrowbandMeasurementAlert(alertHandlerInput: AlertDtos.AlertHandlerInput, alertRules: AlertRule[], tScope?: TransactionScope): Promise<void> {
    try {
      let alerts: Alert[];
      const transactionScope = tScope ?? this.getTransactionScope();

      for (const alertRule of alertRules) {
        const alert = new Alert();
        alert.status = AlertStatusTypes.PENDING;
        alert.site = alertHandlerInput.sensor.site;
        alert.sensor = alertHandlerInput.sensor;
        alert.alertRule = alertRule;
        alert.resolvedBy = "none";
        alerts.push(alert);
      }

      transactionScope.bulkInsert(alerts);
      if (!tScope) await transactionScope.commit();
    } catch (error) {
      throw new Error(error);
    }
  }

  async wirepassAlertHandler(alertHandlerInput: AlertDtos.AlertHandlerInput, alertRules: AlertRule[], tScope?: TransactionScope): Promise<void> {
    try {
      /*   let alerts: Alert[];
      const transactionScope = tScope ?? this.getTransactionScope();
      for (const alertRule of alertRules) {
        const alert = new Alert();
        alert.status = AlertStatusTypes.PENDING;
        alert.site = alertHandlerInput.sensor.site;
        alert.sensor = alertHandlerInput.sensor;
        alert.alertRule = alertRule;
        alert.resolvedBy = "none";
        alerts.push(alert);
      }
      transactionScope.addCollection(alerts);
      if (!tScope) await transactionScope.commit(); */
    } catch (error) {
      throw new Error(error);
    }
  }

  async createAlert(input: AlertDtos.CreateAlertInput, tScope?: TransactionScope): Promise<Alert> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();

      let personel: Personnel;
      const alert = new Alert();

      const [alertRule] = await this.alertRuleService.getAlertRule({
        id: input.alertRuleId,
      });
      if (!alertRule) throw new NoRecordFoundException("Invalid alert rule specified");

      const site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");

      const sensor = await this.sensorService.getSensorById(input.sensorId);
      if (!sensor) throw new NoRecordFoundException("Invalid sensor specified");

      if (input.personnelId) {
        [personel] = await this.personelService.getPersonnels({
          id: input.personnelId,
        });
        if (!personel) throw new NoRecordFoundException("Invalid personel specified");
      }

      alert.alertRule = alertRule;
      alert.site = site;
      alert.sensor = sensor;
      alert.status = AlertStatusTypes.PENDING;
      if (input.personnelId) alert.personnel = personel;

      transactionScope.add(alert);
      if (!tScope) await transactionScope.commit();
      return alert;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAlert(params: CommonDTOs.FilterParam): Promise<Alert[]> {
    try {
      const alert = await this.alertRepository.getAlert(params).getMany();
      return alert;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAlerts(input: AlertDtos.GetAllAlerts): Promise<Alert[]> {
    try {
      const filterInput = JsonToObject(input.filterInputString);

      const site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");

      const alerts = await this.alertRepository.getAlerts(input, filterInput).getMany();
      return alerts;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAlert(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const alerts = await this.getAlert(params);
      if (!tScope && !alert.length) throw new NoRecordFoundException("Invalid alertRule specified");

      transactionScope.deleteCollection(alerts);

      if (!tScope) await transactionScope.commit();
      return { message: "Alert deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }
}
