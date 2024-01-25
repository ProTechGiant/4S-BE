import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { CommonDTOs } from "../common/dto";
import { AlertTypes } from "../common/enums";
import { Sensor } from "../sensor/entity/sensor.entity";
import { NarrowbandSensorDto } from "./dto/narrowband-sensor.dto";
import { NarrowbandLocationData } from "./entity/narrowband-location-data.entity";
import { NarrowbandSensor } from "./entity/narrowband-sensor.entity";
import { NarrowbandSensorPayload } from "./interfaces/narroband-sensor-payload.interface";
import { NarrowbandLocationDataService } from "./narrowband-location-data.service";
import { NarrowbandSensorRepository } from "./narrowband-sensor.repository";

export class NarrowbandSensorService extends BaseService {
  private readonly narrowbandSensorRepository: NarrowbandSensorRepository;

  constructor() {
    super();
    this.narrowbandSensorRepository = new NarrowbandSensorRepository();
  }

  async getNarrowbandSensor(
    params: CommonDTOs.FilterParam
  ): Promise<NarrowbandSensor> {
    try {
      return this.narrowbandSensorRepository
        .getNarrowbandSensor(params)
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNarrowbandSensorById(sensorId: string): Promise<NarrowbandSensor> {
    try {
      return this.narrowbandSensorRepository
        .getNarrowbandSensorBySensorId(sensorId)
        .getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  parseNarrowbandSensorEvent(
    event: NarrowbandSensorPayload
  ): NarrowbandLocationData {
    const nbLocationData = new NarrowbandLocationData();
    event?.data?.forEach((item) => {
      if (item.gp) {
        const gp = item.gp.split(",");
        // To find the lat and lag the location of the sensor
        if (gp.length >= 2) {
          nbLocationData.longitude = parseFloat(gp[0]);
          nbLocationData.latitude = parseFloat(gp[1]);
        }
      }
      nbLocationData.timeStamp = item?.tm ? item.tm : nbLocationData.timeStamp;
      nbLocationData.wifi = item?.wi ? item.wi : nbLocationData.wifi;
      nbLocationData.alarm = item?.wn ? item.wn : nbLocationData.alarm;
      nbLocationData.cumulativeSteps = item?.st
        ? item.st
        : nbLocationData.cumulativeSteps;
      nbLocationData.battery = item?.ba ? item.ba : nbLocationData.battery;
      nbLocationData.networkInfoStrength = item?.sn
        ? item.sn
        : nbLocationData.networkInfoStrength;
    });
    return nbLocationData;
  }

  async createNarrowbandSensor(
    input: NarrowbandSensorDto.CreateNarrowbandSensorDto,
    sensor: Sensor
  ): Promise<NarrowbandSensor> {
    try {
      const narrowbandSensor = new NarrowbandSensor();
      narrowbandSensor.sensor = sensor;
      narrowbandSensor.id = input.id;
      return narrowbandSensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteNarrowbandSensor(
    params: CommonDTOs.FilterParam,
    tScope?: TransactionScope
  ): Promise<NarrowbandSensor> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const narrowbandSensor = await this.getNarrowbandSensor(params);

      narrowbandSensor.transactionScope = transactionScope;

      transactionScope.delete(narrowbandSensor);
      if (!tScope) await transactionScope.commit();
      return narrowbandSensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  getAlertTypeByAlarmValue(alarm: number): AlertTypes {
    switch (alarm) {
      case 1:
        return AlertTypes.LOW_BATTERY;
      case 2:
        return AlertTypes.SOS;
      case 3:
        return AlertTypes.SHUTDOWN;
      case 4:
        return AlertTypes.PICK_OFF;
      case 5:
        return AlertTypes.SIT_FOR_LONG_TIME;
      case 6:
        return AlertTypes.SHAKE;
      case 7:
        return AlertTypes.WEAR;
      case 8:
        return AlertTypes.UNPACKING_ALARM;
      case 9:
        return AlertTypes.CHARGE;
      case 10:
        return AlertTypes.UNPLUG_THE_POWER;
      case 11:
        return AlertTypes.SIGN_IN;
      case 12:
        return AlertTypes.SIGN_OUT;
      case 13:
        return AlertTypes.MANUAL_SOS_SHUTDOWN;
      default:
        return null;
    }
  }
}
