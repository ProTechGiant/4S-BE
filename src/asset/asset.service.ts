import { BaseService } from "../base/base.service";
import { AssetDtos } from "./dto/asset.dto";
import { NoRecordFoundException, NotFoundException } from "../errors/exceptions";
import { AssetRepository } from "./asset.repository";
import { Asset } from "./entity/asset.entity";
import { WirepasFloorlevelService } from "../wirepas/wirepas-floorlevel.service";
import { WirepasBuildingService } from "../wirepas/wirepas-building.service";
import { SiteService } from "../site/site.service";
import { WirepasFloorlevel } from "../wirepas/entity/wirepass-floorlevel.entity";
import { WirepasBuilding } from "../wirepas/entity/wirepas-building.entity";
import { Site } from "../site/entity/site.entity";
import { CommonDTOs } from "../common/dto";
import { TransactionScope } from "../base/transactionScope";
import { AssetSensorService } from "../asset-sensor/asset-sensor.service";
import { AssetSensor } from "../asset-sensor/entity/asset-sensor.entity";
import { CsvParser } from "../common/utils/csv-parser";
import imageToBlob from "../common/utils/image-to-blob";

export class AssetService extends BaseService {
  private readonly wirepasFloorlevelService: WirepasFloorlevelService;
  private readonly wirepasBuildingService: WirepasBuildingService;
  private readonly assetRepository: AssetRepository;
  private readonly siteService: SiteService;
  private readonly assetSensorService: AssetSensorService;

  constructor() {
    super();
    this.wirepasBuildingService = new WirepasBuildingService();
    this.assetRepository = new AssetRepository();
    this.siteService = new SiteService();
    this.wirepasFloorlevelService = new WirepasFloorlevelService();
    this.assetSensorService = new AssetSensorService();
  }

  async updateAsset(input: AssetDtos.UpdateAssetDto, params: CommonDTOs.FilterParam): Promise<Asset> {
    try {
      const transactionScope = this.getTransactionScope();
      let wirepasFloorLevel: WirepasFloorlevel;
      let site: Site;
      let building: WirepasBuilding;

      const [asset] = await this.getAsset(params);
      if (!asset) throw new NoRecordFoundException("Invalid asset specified");

      if (input.wirepasFloorLevelId) {
        [wirepasFloorLevel] = await this.wirepasFloorlevelService.getWirepasFloorlevel({ id: input.wirepasFloorLevelId });
        if (!wirepasFloorLevel) throw new NoRecordFoundException("Invalid wirepasFloorLevel specified");
      }
      if (input.siteId) {
        site = await this.siteService.getSiteById(input.siteId);
        if (!site) throw new NoRecordFoundException("Invalid site specified");
      }
      if (input.wirepasBuildingId) {
        building = await this.wirepasBuildingService.getWirepasBuildingById(input.wirepasBuildingId);
        if (!building) throw new NoRecordFoundException("Invalid building specified");
      }

      if (input.image) asset.image = Buffer.from(input.image);
      if (input.wirepasBuildingId) asset.wirepasBuilding = building;
      if (input.wirepasFloorLevelId) asset.wirepasFloorlevel = wirepasFloorLevel;
      if (input.siteId) asset.site = site;
      if (input.name) asset.name = input.name;
      if (input.model) asset.model = input.model;
      if (input.serialNumber) asset.serialNumber = input.serialNumber;
      if (input.warrantyDate) asset.warrantyDate = new Date(input.warrantyDate);
      if (input.issueDate) asset.issueDate = new Date(input.issueDate);
      if (input.deviceType) asset.deviceType = input.deviceType;

      transactionScope.update(asset);
      transactionScope.commit();
      return asset;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAsset(params: CommonDTOs.FilterParam, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const assets = await this.getAsset(params);
      if (!assets) throw new NoRecordFoundException("Invalid asset specified");

      for (const asset of assets) {
        const assetSensor = await this.assetSensorService.getAssetSensor({ asset: asset.id });
        transactionScope.deleteCollection(assetSensor);
        asset.transactionScope = transactionScope;
      }

      transactionScope.deleteCollection(assets);
      if (!tScope) await transactionScope.commit();
      return { message: "Asset deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAsset(params: CommonDTOs.FilterParam): Promise<Asset[]> {
    try {
      return await this.assetRepository.getAsset(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async createAsset(input: AssetDtos.CreateAssetDto, tScope?: TransactionScope): Promise<Asset> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();
      const site = await this.siteService.getSiteById(input.siteId);
      const [wirepasBuilding] = await this.wirepasBuildingService.getBuilding({ id: input.wirepasBuildingId });
      const [wirepasFloorlevel] = await this.wirepasFloorlevelService.getWirepasFloorlevel({ id: input.wirepasFloorlevelId });
      const asset = new Asset();
      asset.name = input.name;
      asset.model = input.model;
      asset.deviceType = input.deviceType;
      asset.serialNumber = input.serialNumber;
      asset.warrantyDate = new Date(input.warrantyDate);
      asset.issueDate = new Date(input.issueDate);
      if (input.imageUrl) asset.image = await imageToBlob(input.imageUrl);
      asset.wirepasBuilding = wirepasBuilding;
      asset.wirepasFloorlevel = wirepasFloorlevel;
      asset.site = site;

      if (input.sensorIdz) {
        asset.assetSensor = await this.assetSensorService.linkAssetWithSensors(asset, input.sensorIdz, transactionScope);
      }
      if (!tScope) {
        transactionScope.add(asset);
        await transactionScope.commit();
      }
      return asset;
    } catch (error) {
      throw new Error(error);
    }
  }

  async bulkImportAsset(file: CommonDTOs.CommonFileType): Promise<CommonDTOs.MessageResponse> {
    try {
      const data = (await CsvParser(file.path)) as AssetDtos.CreateAssetDto[];
      const transactionScope = this.getTransactionScope();
      const assets: Asset[] = [];
      const assetSensors: AssetSensor[] = [];
      for (let asset of data) {
        const assetExist = await this.assetRepository.getAsset({ name: asset.name, model: asset.model, serialNumber: asset.serialNumber }).getOne();
        if (!assetExist) {
          const assetData = await this.createAsset(asset, transactionScope);
          if (assetData.assetSensor) assetSensors.push(...assetData.assetSensor);
          assets.push(assetData);
        }
      }
      transactionScope.addCollection(assets);
      transactionScope.addCollection(assetSensors);
      await transactionScope.commit();
      return { message: "Data saved" };
    } catch (error) {
      throw new Error(error);
    }
  }
}
