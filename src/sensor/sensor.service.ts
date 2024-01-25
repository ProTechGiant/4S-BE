import { BaseService } from "../base/base.service";
import { JsonToObject } from "../common/utils/json-to-object";
import { NoRecordFoundException, NotAcceptableException } from "../errors/exceptions";
import { SiteService } from "../site/site.service";
import { WirepasSensorDto } from "../wirepas/dto/wirepas-sensor.dto";
import { WirepasSensorService } from "../wirepas/wirepas-sensor.service";
import { SensorDto } from "./dto/sensor.dto";
import { Sensor } from "./entity/sensor.entity";
import { SensorProtocolTypes, SensorUploadDataTypes } from "./enum/sensor.enum";
import { SensorRepository } from "./sensor.repository";
import { CommonDTOs } from "../common/dto";
import { TransactionScope } from "../base/transactionScope";
import { NarrowbandSensorService } from "../narrowband/narrowband-sensor.service";
import { NarrowbandSensorPayload } from "../narrowband/interfaces/narroband-sensor-payload.interface";
import { NarrowbandSensor } from "../narrowband/entity/narrowband-sensor.entity";
import { NarrowbandSensorDto } from "../narrowband/dto/narrowband-sensor.dto";
import { NarrowbandLocationData } from "../narrowband/entity/narrowband-location-data.entity";
import { CsvParser } from "../common/utils/csv-parser";
import { ItemType, getUniqueItemsByProperty } from "../common/utils/get-unique-item";
import { AlertService } from "../alert/alert.service";
import { AlertTypes } from "../common/enums";
import { NarrowbandLocationDataService } from "../narrowband/narrowband-location-data.service";
import { WirepasSensor } from "../wirepas/entity/wirepas-sensor.entity";
import { Alert } from "../alert/entity/alert.entity";
import { User } from "../user/entity/user.entity";
import { AlertRuleSensor } from "../alert-rule-sensor/entity/alert-rule-sensor.entity";
import { AlertRule } from "../alert-rule/entity/alert-rule.entity";
import { AlertRuleSensorRepository } from "../alert-rule-sensor/alert-rule-sensor.repository";

export class SensorService extends BaseService {
  private readonly sensorRepository: SensorRepository;
  private readonly siteService: SiteService;
  private readonly narrowbandSensorService: NarrowbandSensorService;
  private readonly narrowbandLocationDataService: NarrowbandLocationDataService;
  private readonly alertRuleSensorRepository: AlertRuleSensorRepository;

  constructor() {
    super();
    this.sensorRepository = new SensorRepository();
    this.siteService = new SiteService();
    this.narrowbandSensorService = new NarrowbandSensorService();
    this.narrowbandLocationDataService = new NarrowbandLocationDataService();
    this.alertRuleSensorRepository = new AlertRuleSensorRepository();
  }

  async getSensorsWithSiteOrWithoutSite(input: SensorDto.GetSensorWithSiteDto): Promise<{ data: Sensor[]; totalRecored: number }> {
    try {
      const filterObject = JsonToObject(input.filterInputString);
      const [sensors, totalRecored] = await this.sensorRepository.getSensorsWithSiteOrWithoutSite(input, filterObject).getManyAndCount();
      return { data: sensors, totalRecored };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSensors(input: SensorDto.GetSensorDto): Promise<Sensor[]> {
    try {
      const filterObject = JsonToObject(input.filterInputString);
      const sensors = await this.sensorRepository.getSensors(filterObject, input.protocol, input.siteId).getMany();
      return sensors;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteSensor(id: string, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();

      const sensor = await this.getSensorById(id);
      if (!sensor) throw new NotAcceptableException("Invalid sensor specified");
      sensor.transactionScope = transactionScope;

      transactionScope.delete(sensor);
      if (!tScope) await transactionScope.commit();

      return { message: "Sensor deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSensorById(id: string | number, protocol?: SensorProtocolTypes): Promise<Sensor> {
    try {
      const sensors = await this.sensorRepository.getSensorById(id, protocol).getOne();
      return sensors;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSensorByIdz(idz: string[]): Promise<Sensor[]> {
    try {
      return this.sensorRepository.getSensorByIdz(idz).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async createSensorIfNotExist(input: any, protocol: SensorProtocolTypes): Promise<NarrowbandLocationData | CommonDTOs.SensorAlertType> {
    switch (protocol) {
      case SensorProtocolTypes.WIREPAS:
        return this.handleWirepasSensor(input);

      case SensorProtocolTypes.NARROWBAND:
        return await this.handleNarrowbandSensorData(input);
      default:
        throw new NotAcceptableException("Sensor protocol not supported");
    }
  }

  async handleWirepasSensor(input: any): Promise<CommonDTOs.SensorAlertType> {
    const wirepasSensorService = new WirepasSensorService();
    const sensor = await wirepasSensorService.handleWirepasSensor(input);
    const alert = await wirepasSensorService.handleWirepasSensorAlerts(input);
    return { sensor, alert };
  }

  async handleNarrowbandSensorData(event: NarrowbandSensorPayload): Promise<NarrowbandLocationData> {
    // In this method Alert Processing will be started
    const transactionScope = this.getTransactionScope();
    try {
      const alertService = new AlertService();
      const nbLocationData = this.narrowbandSensorService.parseNarrowbandSensorEvent(event);

      let sensor: Sensor = await this.getSensorById(event.imei, SensorProtocolTypes.NARROWBAND);
      let narrowbandSensor: NarrowbandSensor = await this.narrowbandSensorService.getNarrowbandSensorById(event.imei);
      if (!sensor || !narrowbandSensor) {
        throw new NotAcceptableException("Sensor with give imei in event does not exist in Database");
      }

      // if both already exist in database than create the Narrowband Location Data entry in DB.
      nbLocationData.narrowbandSensor = narrowbandSensor;
      nbLocationData.narrowbandSensor;
      transactionScope.add(nbLocationData);
      // before commiting get the last location data
      const lastNbLocationData = await this.narrowbandLocationDataService.getLastNarrowbandLocationData();
      await transactionScope.commit();
      const alertType = this.narrowbandSensorService.getAlertTypeByAlarmValue(nbLocationData.alarm);
      // Get Previous Location Data
      const promises = [
        alertService.alertHandler({
          alertType: AlertTypes.MOVED_INSIDE_AREA,
          sensor,
          data: {
            currentLocation: nbLocationData,
            previousLocation: lastNbLocationData,
          },
        }),
        alertService.alertHandler({
          alertType: AlertTypes.MOVED_OUTSIDE_AREA,
          sensor,
          data: {
            currentLocation: nbLocationData,
            previousLocation: lastNbLocationData,
          },
        }),
      ];
      if (alertType) {
        promises.push(
          alertService.alertHandler({
            alertType,
            sensor,
            data: {
              currentLocation: nbLocationData,
              previousLocation: lastNbLocationData,
            },
          })
        );
      }

      await Promise.all(promises);
      return nbLocationData;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleNarrowbandSensorCSVData(data: NarrowbandSensorDto.NarrowbandSensorsCSVPayload): Promise<NarrowbandSensor[]> {
    const transactionScope = this.getTransactionScope();
    try {
      const result = await Promise.all(
        data.imeies.map(async (imei) => {
          let sensor: Sensor = await this.getSensorById(imei, SensorProtocolTypes.NARROWBAND);
          let narrowbandSensor: NarrowbandSensor = await this.narrowbandSensorService.getNarrowbandSensorById(imei);
          const isSensorAlreadyExist = !!sensor;
          if (!sensor) {
            sensor = await this.createSensor(
              {
                protocol: SensorProtocolTypes.NARROWBAND,
                siteId: data.siteId,
                type: SensorProtocolTypes.NARROWBAND,
              },
              imei
            );
            let input = new NarrowbandSensor();
            input.id = imei;
            narrowbandSensor = await this.narrowbandSensorService.createNarrowbandSensor(input, sensor);
            sensor.narrowbandSensor = narrowbandSensor;
            transactionScope.add(sensor);
            sensor.narrowbandSensor = null;
            if (!isSensorAlreadyExist) {
              transactionScope.add(narrowbandSensor);
            }
            transactionScope.commit();
          }
          return narrowbandSensor;
        })
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createSensor(input: SensorDto.CreateSensorDto, id: string | number, tScope?: TransactionScope): Promise<Sensor> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const sensor = new Sensor();
      const site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");
      sensor.protocol = input.protocol;
      sensor.type = input.type;
      sensor.site = site;
      sensor.id = id.toString();
      if (!tScope) {
        await transactionScope.commit();
        transactionScope.add(sensor);
      }
      return sensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleUploadSensorData(type: SensorUploadDataTypes, data: NarrowbandSensorPayload | NarrowbandSensorDto.NarrowbandSensorsCSVPayload): Promise<NarrowbandLocationData | NarrowbandSensor[] | string> {
    switch (type) {
      case SensorUploadDataTypes.NARROWBAND_SENSOR_EVENT:
        return await this.handleNarrowbandSensorData(data as NarrowbandSensorPayload);
      case SensorUploadDataTypes.NARROWBAND_SENSORS_CSV:
        return await this.handleNarrowbandSensorCSVData(data as NarrowbandSensorDto.NarrowbandSensorsCSVPayload);
      default:
        throw new NotAcceptableException("given sensor upload data type not supported");
    }
  }

  async bulkImportSensors(protocol: SensorProtocolTypes, file: CommonDTOs.CommonFileType): Promise<CommonDTOs.MessageResponse> {
    const data = await CsvParser(file.path);
    const transactionScope = this.getTransactionScope();

    if (protocol === SensorProtocolTypes.WIREPAS) {
      const wirepasSensorService = new WirepasSensorService();
      const uniqueItems = getUniqueItemsByProperty(data as ItemType[], "node_address");
      await wirepasSensorService.handleWirepasSensor({ nodes: uniqueItems } as WirepasSensorDto.CreateWirepasSensorDataDto, transactionScope);
    }

    await transactionScope.commit();
    return { message: "Data saved" };
  }
}
