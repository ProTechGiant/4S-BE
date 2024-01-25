import { BaseService } from "../base/base.service";
import { NoRecordFoundException, NotFoundException } from "../errors/exceptions";
import { SiteService } from "../site/site.service";
import { Area } from "./entity/area.entity";
import { WirepasAreaService } from "../wirepas/wirepas-area.service";
import { CommonDTOs } from "../common/dto";
import { AreaDtos } from "./dto/area.dto";
import { SensorProtocolTypes } from "../sensor/enum/sensor.enum";
import { WirepasArea } from "../wirepas/entity/wirepas-area.entity";
import { AreaRepository } from "./area.repository";
import { Site } from "../site/entity/site.entity";
import { TransactionScope } from "../base/transactionScope";
import { NarrowbandAreaService } from "../narrowband/narrowband-area.service";

export class AreaService extends BaseService {
  private readonly siteService: SiteService;
  private readonly wirepasAreaService: WirepasAreaService;
  private readonly narrowbandAreaService: NarrowbandAreaService;
  private readonly areaRepository: AreaRepository;

  constructor() {
    super();
    this.wirepasAreaService = new WirepasAreaService();
    this.narrowbandAreaService = new NarrowbandAreaService();
    this.siteService = new SiteService();
    this.areaRepository = new AreaRepository();
  }

  async createArea(input: AreaDtos.CreateAreaInput, currentUser: CommonDTOs.CurrentUser): Promise<Area> {
    try {
      const area = new Area();
      const transactionScope = this.getTransactionScope();

      const site = await this.siteService.getSiteById(input.data.siteId);
      if (!site) throw new NoRecordFoundException("Invalid site specified");

      area.coordinates = input.data.coordinates;
      area.a = input.data.a;
      area.b = input.data.b;
      area.r = input.data.r;
      area.g = input.data.g;
      area.site = site;
      area.protocol = input.protocol;

      if (input.protocol === SensorProtocolTypes.WIREPAS) {
        await this.wirepasAreaService.createWirepasArea(input.data, area, currentUser, transactionScope);
      } else if (input.protocol === SensorProtocolTypes.NARROWBAND) {
        await this.narrowbandAreaService.createNarrowbandArea(area, transactionScope);
      }

      transactionScope.add(area);
      await transactionScope.commit();
      delete area.wirepasArea;
      return area;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateArea(input: AreaDtos.UpdateAreaDto, params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser): Promise<Area> {
    try {
      let site: Site;
      let wirepasArea: WirepasArea;

      const transactionScope = this.getTransactionScope();

      const [area] = await this.getArea(params);
      if (!area) throw new NoRecordFoundException("Invalid area specified");
      area.loadSnapshotForPartialUpdate();

      if (input.siteId) {
        site = await this.siteService.getSiteById(input.siteId);
        if (!site) throw new NotFoundException("Invalid site specification");
      }

      if (input.a) area.a = input.a;
      if (input.r) area.r = input.r;
      if (input.g) area.g = input.g;
      if (input.b) area.b = input.b;
      if (input.description) area.description = input.description;
      if (input.coordinates) area.coordinates = input.coordinates;
      if (input.siteId) area.site = site;
      if (area.protocol === SensorProtocolTypes.WIREPAS) {
        wirepasArea = await this.wirepasAreaService.updateWirepasArea(input, area, { area: params.id }, currentUser, transactionScope);
      }
      transactionScope.update(area);
      await transactionScope.commit();
      return area;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getArea(params?: CommonDTOs.FilterParam): Promise<Area[]> {
    try {
      return await this.areaRepository.getArea(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAreas(): Promise<Area[]> {
    try {
      return await this.areaRepository.getAreas().getMany();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAreasBySensorIdz(sensorIdz): Promise<Area[]> {
    try {
      return await this.areaRepository.getAreasBySensorIdz(sensorIdz).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFirstArea(): Promise<Area> {
    try {
      const area = await this.areaRepository.getArea().getOne();
      return area;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteArea(params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();

      const areas = await this.getArea(params);
      if (!tScope && !areas.length) throw new NoRecordFoundException("Invalid Area specified");

      for (const area of areas) {
        area.transactionScope = transactionScope;
        if (area.protocol === SensorProtocolTypes.WIREPAS) {
          await this.wirepasAreaService.deleteWirepasArea({ area: area.id }, currentUser, transactionScope);
        }
      }

      transactionScope.deleteCollection(areas);
      if (!tScope) await transactionScope.commit();

      return { message: "Area deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }
}
