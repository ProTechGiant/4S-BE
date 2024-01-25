import { BaseService } from "../base/base.service";
import { Sensor } from "../sensor/entity/sensor.entity";
import { WirepasBuildingService } from "./wirepas-building.service";
import { WirepasSensorDto } from "./dto/wirepas-sensor.dto";
import { WirepasData } from "./entity/wirepas-data.entity";
import { WirepasSensor } from "./entity/wirepas-sensor.entity";
import { WirepasFloorlevelService } from "./wirepas-floorlevel.service";
import { WirepasSensorRepository } from "./wirepas-sensor.repository";
import { CommonDTOs } from "../common/dto";
import { TransactionScope } from "../base/transactionScope";
import { SensorService } from "../sensor/sensor.service";
import { SensorProtocolTypes } from "../sensor/enum/sensor.enum";
import { AlertRuleService } from "../alert-rule/alert-rule.service";
import { AlertCriteriaTypes, AlertTypes } from "../common/enums";
import { AlertService } from "../alert/alert.service";
import { Alert } from "../alert/entity/alert.entity";
import { isPointInsidePolygon } from "../common/utils/check-point-inside-area";
import EventEmitter from "events";
import { redisConnection } from "../redis";

export class WirepasSensorService extends BaseService {
  private readonly wirepasSensorRepository: WirepasSensorRepository;
  private readonly wirepasBuildingService: WirepasBuildingService;
  private readonly wirepasFloorlevelService: WirepasFloorlevelService;
  private readonly alertRuleService: AlertRuleService;
  private readonly alertService: AlertService;
  private readonly eventEmitter: EventEmitter;

  constructor() {
    super();
    this.eventEmitter = new EventEmitter();
    this.wirepasBuildingService = new WirepasBuildingService();
    this.wirepasFloorlevelService = new WirepasFloorlevelService();
    this.alertRuleService = new AlertRuleService();
    this.wirepasSensorRepository = new WirepasSensorRepository();
    this.alertService = new AlertService();
  }

  async getWirepasSensor(params: CommonDTOs.FilterParam): Promise<WirepasSensor> {
    try {
      return this.wirepasSensorRepository.getWirepasSensor(params).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasData(params: CommonDTOs.FilterParam): Promise<WirepasData[]> {
    try {
      return this.wirepasSensorRepository.getWirepasData(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getLastWirepasData(): Promise<WirepasData> {
    try {
      return this.wirepasSensorRepository.getLastWirepasData().getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteWirepasSensor(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<WirepasSensor> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const wirepasSensor = await this.getWirepasSensor(params);

      wirepasSensor.transactionScope = transactionScope;

      transactionScope.delete(wirepasSensor);
      if (!tScope) await transactionScope.commit();
      return wirepasSensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteWirepasData(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<WirepasData[]> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const wirepasData = await this.getWirepasData(params);
      transactionScope.deleteCollection(wirepasData);
      if (!tScope) await transactionScope.commit();
      return wirepasData;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createWirepasSensor(input: WirepasSensorDto.WirepasSensorDataDto, sensor: Sensor, tScope?: TransactionScope): Promise<WirepasSensor> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const wirepasSensor = new WirepasSensor();
      const wirepasBuilding = await this.wirepasBuildingService.getWirepasBuildingWithSiteById(input.building_id);
      const [wirepasFloorlevel] = await this.wirepasFloorlevelService.getWirepasFloorlevel({ id: input.floor_plan_id });
      wirepasSensor.sensor = sensor;
      wirepasSensor.wirepasFloorlevel = wirepasFloorlevel;
      wirepasSensor.wntGatewayId = input.network_address;
      wirepasSensor.wirepasBuilding = wirepasBuilding;
      wirepasSensor.wntGatewayName = input.node_name;
      wirepasSensor.id = input.node_address;
      if (!tScope) {
        transactionScope.add(wirepasSensor);
        await transactionScope.commit();
      }
      return wirepasSensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createWirepasSensorData(input: WirepasSensorDto.WirepasSensorDataDto, wirepasSensor: WirepasSensor, tScope?: TransactionScope): Promise<WirepasData> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const wirepasData = new WirepasData();
      wirepasData.wirepasSensor = wirepasSensor;
      wirepasData.onlineStatus = input.online_status;
      wirepasData.voltage = input.voltage;
      wirepasData.latitude = input.latitude;
      wirepasData.longitude = input.longitude;
      wirepasData.isApproved = input.is_approved;
      wirepasData.altitude = input.altitude;
      wirepasData.positionPixelX = input.position_pixel_x;
      wirepasData.positionPixelY = input.position_pixel_y;
      wirepasData.positionMeterX = input.position_meter_x.toString();
      wirepasData.positionMeterY = input.position_meter_y.toString();
      wirepasData.positioningRole = input.positioning_role;
      wirepasData.measuremenTime = new Date(input.measurement_time);
      wirepasData.positioningTime = new Date(input.positioning_time);
      wirepasData.wirepasBuildingId = input.building_id;
      wirepasData.wirepasBuildingName = input.building_name;
      wirepasData.floorPlanId = input.floor_plan_id;
      wirepasData.floorPlanName = input.floor_plan_name;
      wirepasData.wirepasAreas = JSON.parse(JSON.stringify(input.areas));
      wirepasData.nodeAddress = input.node_address;
      wirepasData.networkAddress = input.network_address;
      if (!tScope) {
        transactionScope.add(wirepasData);
        await transactionScope.commit();
      }
      return wirepasData;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleWirepasSensor(input: WirepasSensorDto.CreateWirepasSensorDataDto, tScope?: TransactionScope): Promise<void | Sensor[]> {
    const sensors = [];
    const wirepasSensors = [];
    const wirepasDataArr = [];
    const sensorService = new SensorService();
    const transactionScope = tScope ?? this.getTransactionScope();

    try {
      for (const node of input.nodes) {
        let sensor: Sensor = await sensorService.getSensorById(node.node_address, SensorProtocolTypes.WIREPAS);
        let wirepasSensor = await this.getWirepasSensor({ id: node.node_address });
        const wirepasBuilding = await this.wirepasBuildingService.getWirepasBuildingWithSiteById(node.building_id);

        if (!sensor) {
          sensor = await sensorService.createSensor(
            {
              protocol: SensorProtocolTypes.WIREPAS,
              siteId: wirepasBuilding.site?.id,
              type: node.positioning_role_string,
            },
            node.node_address,
            transactionScope
          );
          sensors.push(sensor);
        }

        if (!wirepasSensor) {
          wirepasSensor = await this.createWirepasSensor(node, sensor, transactionScope);
          wirepasSensors.push(wirepasSensor);
        }
        const wirepasData = await this.createWirepasSensorData(node, wirepasSensor, transactionScope);
        wirepasDataArr.push(wirepasData);
      }

      transactionScope.bulkInsert(sensors);
      transactionScope.bulkInsert(wirepasSensors);
      transactionScope.bulkInsert(wirepasDataArr);
      if (!tScope) await transactionScope.commit();
      return sensors;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleWirepasSensorAlerts(input: WirepasSensorDto.CreateWirepasSensorDataDto, tScope?: TransactionScope): Promise<Alert[]> {
    try {
      const alertRules = await this.alertRuleService.getAlertRule({ alertType: AlertTypes.LOCATION_ALERT });
      const wirepasData = await this.getLastWirepasData();

      let alerts: Alert[] = [];
      const transactionScope = tScope ?? this.getTransactionScope();
      for (const node of input.nodes) {
        for (const alertRule of alertRules) {
          const points = {
            latitude: node.latitude,
            longitude: node.longitude,
            altitude: node.altitude,
          };
          const isMatched = isPointInsidePolygon(points, alertRule.area.coordinates);
          const lastRecordMatched = isPointInsidePolygon(points, [{ latitude: wirepasData.latitude, longitude: wirepasData.latitude }]);
          const coordinatesIsMatched = (!isMatched && lastRecordMatched) || (isMatched && !lastRecordMatched);
          if ((coordinatesIsMatched && alertRule.alertCriteria === AlertCriteriaTypes.INDOORBOUND) || (!coordinatesIsMatched && alertRule.alertCriteria === AlertCriteriaTypes.OUTDOORBOUND)) {
            const wirepasBuilding = await this.wirepasBuildingService.getWirepasBuildingWithSiteById(node.building_id);
            const alert = await this.alertService.createAlert({ alertRuleId: alertRule.id, sensorId: node.node_address, siteId: wirepasBuilding.site.id }, transactionScope);
            alerts.push(alert);
          }
        }
      }
      if (!tScope) await transactionScope.commit();
      this.eventEmitter.emit("alert", input);
      return alerts;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasSensorByFloorlevelWithJoins(floorlevelId: string, input: WirepasSensorDto.GetWirepasSensor, databaseHit: boolean = false): Promise<{ wirepasSensor: WirepasSensor[]; wirepas: WirepasData } | any> {
    try {
      let wirepasData: WirepasSensor | WirepasSensor[];
      let storedFloorlevelData = await redisConnection.get(`sensorListByFloorlevelId:${floorlevelId}`);
      if (!storedFloorlevelData || databaseHit) {
        const wirepasSensor = await this.wirepasSensorRepository.getWirepasSensorByFloorlevelWithJoins(floorlevelId).getMany();

        if (input.pagination) wirepasData = await this.wirepasSensorRepository.getWirepasSensorByFloorlevelWithWirepasData(floorlevelId, input.pagination).getMany();
        else wirepasData = await this.wirepasSensorRepository.getWirepasSensorByFloorlevelWithWirepasData(floorlevelId).getOne();

        const storedFloorlevelData = wirepasSensor.map((item) => {
          const matchingData = Array.isArray(wirepasData) ? wirepasData.find((dataItem) => dataItem.id === item.id) : wirepasData;
          item.wirepasData = matchingData ? [matchingData.wirepasData[0]] : [];
          return item;
        });
        if (storedFloorlevelData) await redisConnection.set(`sensorListByFloorlevelId:${floorlevelId}`, storedFloorlevelData);
      }
      return { wirepasSensor: storedFloorlevelData };
    } catch (error) {
      throw new Error(error);
    }
  }
}
