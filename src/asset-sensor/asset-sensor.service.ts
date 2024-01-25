import { BaseService } from "../base/base.service";
import { CommonDTOs } from "../common/dto";
import { TransactionScope } from "../base/transactionScope";
import { SensorAssetRepository } from "./asset-sensor.repository";
import { NoRecordFoundException } from "../errors/exceptions";
import { AssetSensor } from "./entity/asset-sensor.entity";
import { AssetSensorDtos } from "./dto/asset-sensor.dto";
import { Asset } from "../asset/entity/asset.entity";
import { SensorService } from "../sensor/sensor.service";
import { Sensor } from "../sensor/entity/sensor.entity";
import { AssetService } from "../asset/asset.service";

export class AssetSensorService extends BaseService {
  private readonly sensorAssetRepository: SensorAssetRepository;
  private readonly sensorService: SensorService;

  constructor() {
    super();
    this.sensorAssetRepository = new SensorAssetRepository();
    this.sensorService = new SensorService();
  }

  async deleteAssetSensor(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const assetSensors = await this.getAssetSensor(params);
      if (!assetSensors.length) throw new NoRecordFoundException("Invalid asset specified");

      transactionScope.deleteCollection(assetSensors);
      if (!tScope) await transactionScope.commit();
      return { message: "Asset sensor deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async createAssetSensor(input: AssetSensorDtos.CreateAssetSensorInput, tScope?: TransactionScope): Promise<AssetSensor> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const assetSensor = new AssetSensor();
      const asset = await this.sensorAssetRepository.getAssetById({ id: input.assetId }).getOne();
      if (!asset) throw new NoRecordFoundException("Invalid asset  specified");

      const sensor = await this.sensorService.getSensorById(input.sensorId);
      if (!sensor) throw new NoRecordFoundException("Invalid sensor  specified");

      assetSensor.sensor = sensor;
      assetSensor.asset = asset;

      transactionScope.add(assetSensor);
      if (!tScope) await transactionScope.commit();
      return assetSensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateAssetSensor(input: AssetSensorDtos.UpdateAssetSensorInput, params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<AssetSensor> {
    try {
      let asset: Asset;
      let sensor: Sensor;
      const transactionScope = tScope ?? this.getTransactionScope();

      const [assetSensor] = await this.getAssetSensor(params);
      if (!assetSensor) throw new NoRecordFoundException("Invalid asset sensor specified");

      if (input.assetId) {
        asset = await this.sensorAssetRepository.getAssetById({ id: input.assetId }).getOne();
        if (!asset) throw new NoRecordFoundException("Invalid asset  specified");
        assetSensor.asset = asset;
      }

      if (input.sensorId) {
        sensor = await this.sensorService.getSensorById(input.sensorId);
        if (!sensor) throw new NoRecordFoundException("Invalid sensor  specified");
        assetSensor.sensor = sensor;
      }

      transactionScope.update(assetSensor);
      if (!tScope) await transactionScope.commit();
      return assetSensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAssetSensor(params: CommonDTOs.FilterParam): Promise<AssetSensor[]> {
    try {
      return await this.sensorAssetRepository.getAssetSensor(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async linkSensorWithAsset(input: AssetSensorDtos.CreateAssetSensorDto): Promise<AssetSensor> {
    try {
      const transactionScope = this.getTransactionScope();
      const sensor = await this.sensorService.getSensorById(input.sensorId);
      if (!sensor) throw new NoRecordFoundException("Invalid sensor specified");
      const asset = await this.getAsset(input.assetId);
      if (!asset) throw new NoRecordFoundException("Invalid asset specified");

      const assetSensor = new AssetSensor();
      assetSensor.asset = asset;
      assetSensor.sensor = sensor;
      transactionScope.add(assetSensor);
      await transactionScope.commit();
      return assetSensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async linkAssetWithSensors(asset: Asset, sensorIdz: string[], tScope?: TransactionScope): Promise<AssetSensor[]> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const assetSensors: AssetSensor[] = [];
      const sensors = await this.sensorService.getSensorByIdz(sensorIdz);

      sensors.forEach((sensor) => {
        const assetSensor = new AssetSensor();
        assetSensor.asset = asset;
        assetSensor.sensor = sensor;
        assetSensors.push(assetSensor);
      });
      if (!tScope) {
        transactionScope.addCollection(assetSensors);
        await transactionScope.commit();
      }
      return assetSensors;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAsset(id: string): Promise<Asset> {
    try {
      const assetService = new AssetService();
      const [asset] = await assetService.getAsset({ id });
      return asset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
