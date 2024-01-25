import { NoRecordFoundException, NotFoundException } from "../errors/exceptions";
import { WirepasBuildingDtos } from "./dto/building.dto";
import { BaseService } from "../base/base.service";
import { WirepasBuildingRepository } from "./wirepas-building.repository";
import { WirepasBuilding } from "./entity/wirepas-building.entity";
import { WntGatewayService } from "../sockets/wnt-gateway.service";
import { SiteService } from "../site/site.service";
import { WntActionState, getWntBuildingFormat, getWntGetBuildingFormat } from "./utils/wirepas-building-json.generator";
import { CommonDTOs } from "../common/dto";
import { Site } from "../site/entity/site.entity";
import { WntAuthenticationInput } from "../sockets/interface/wnt-gateway.interface";
import { WntServiceType } from "../sockets/enum/wnt-gateway.enum";
import { WntBuildingReponse } from "../sockets/interface/reponse.interface";
import { TransactionScope } from "../base/transactionScope";
import { JsonToObject } from "../common/utils/json-to-object";

export class WirepasBuildingService extends BaseService {
  private readonly siteService: SiteService;
  private readonly wirepasBuildingRepository: WirepasBuildingRepository;
  private readonly wntGatewayService: WntGatewayService;

  constructor() {
    super();
    this.siteService = new SiteService();
    this.wirepasBuildingRepository = new WirepasBuildingRepository();
    this.wntGatewayService = new WntGatewayService();
  }

  async createWirepasBuilding(input: WirepasBuildingDtos.CreateDto, currentUser: CommonDTOs.CurrentUser): Promise<WirepasBuilding> {
    try {
      const wirepasBuilding = new WirepasBuilding();
      const transactionScope = this.getTransactionScope();
      const site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NotFoundException("Invalid Site specification");

      /* ************ WntGateway ************ */
      const createWntBuildingFormat = getWntBuildingFormat({ name: input.name }, WntActionState.CREATE);
      const wirepasMessage = ((await this.wntGatewayService.handleSendRequest(createWntBuildingFormat, { email: "admin", password: "hdMY3IY2OVtdKcbqBeZp5s4n" }, WntServiceType.BUILDING)) as WntBuildingReponse).data.buildings[0];
      /* ************ WntGateway ************ */

      wirepasBuilding.name = input.name;
      wirepasBuilding.latitude = input.latitude;
      wirepasBuilding.longitude = input.longitude;
      wirepasBuilding.location = input.location;
      wirepasBuilding.streetAddress = input.streetAddress;
      wirepasBuilding.assetCount = 0;
      wirepasBuilding.site = site;
      wirepasBuilding.id = wirepasMessage.id;

      transactionScope.add(wirepasBuilding);
      await transactionScope.commit();
      return wirepasBuilding;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getWirepasBuildingWithFloorLevel(buildingId: string): Promise<WirepasBuilding> {
    try {
      return this.wirepasBuildingRepository.getWirepasBuildingById(buildingId).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getWirepasBuildingsWithFloorLevels(input: WirepasBuildingDtos.GetBuildingsDto): Promise<{ data: WirepasBuilding[]; totalRecored: number }> {
    try {
      const filterInput = JsonToObject(input.filterInputString);
      if (input.siteId) {
        const site = await this.siteService.getSiteById(input.siteId);
        if (!site) throw new NotFoundException("Invalid Site specification");
      }
      const data = await this.wirepasBuildingRepository.getWirepasBuildingsWithFloorLevels(filterInput, input).getMany();
      const totalRecored = await this.wirepasBuildingRepository.getWirepasBuildingsWithFloorLevels(filterInput, input).getCount();
      return {
        data,
        totalRecored,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateWirepasBuilding(input: WirepasBuildingDtos.UpdateWirepasBuildingDto, currentUser: CommonDTOs.CurrentUser, wirepasBuildingId: string): Promise<WirepasBuilding> {
    try {
      let site: Site;
      const transactionScope = this.getTransactionScope();

      const wirepasBuilding = await this.getWirepasBuildingById(wirepasBuildingId);
      if (!wirepasBuilding) throw new NoRecordFoundException("Invalid wirepasBuilding specified");
      wirepasBuilding.loadSnapshotForPartialUpdate();

      if (input.siteId) {
        site = await this.siteService.getSiteById(input.siteId);
        if (!site) throw new NotFoundException("Invalid site Specified");
      }

      /* ************ WntGateway ************ */
      const updateWntBuildingFormat = getWntBuildingFormat({ name: input.name, id: wirepasBuilding.id }, WntActionState.UPDATE);
      await this.wntGatewayService.handleSendRequest(updateWntBuildingFormat, currentUser as WntAuthenticationInput, WntServiceType.BUILDING);
      /* ************ WntGateway ************ */

      if (input.name) wirepasBuilding.name = input.name;
      if (input.latitude) wirepasBuilding.latitude = input.latitude;
      if (input.longitude) wirepasBuilding.longitude = input.longitude;
      if (input.location) wirepasBuilding.location = input.location;
      if (input.streetAddress) wirepasBuilding.streetAddress = input.streetAddress;
      if (input.siteId) wirepasBuilding.site = site;

      transactionScope.update(wirepasBuilding);
      await transactionScope.commit();
      return wirepasBuilding;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteWirepasBuilding(params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();

      const wirepasBuildings = await this.getBuilding(params);
      if (!tScope && !wirepasBuildings.length) throw new NoRecordFoundException("Invalid floorlevel specified");

      /* ************ WntGateway ************ */
      for (const wirepasBuilding of wirepasBuildings) {
        const deleteWntBuildingFormat = getWntBuildingFormat({ id: wirepasBuilding.id }, WntActionState.DELETE);
        await this.wntGatewayService.handleSendRequest(deleteWntBuildingFormat, currentUser as WntAuthenticationInput, WntServiceType.BUILDING);
      }
      /* ************ WntGateway ************ */

      for (const building of wirepasBuildings) {
        building.currentUser = currentUser;
        building.transactionScope = transactionScope;
      }

      transactionScope.deleteCollection(wirepasBuildings);
      if (!tScope) await transactionScope.commit();

      return { message: "Building deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasBuildingById(id: string): Promise<WirepasBuilding> {
    try {
      return this.wirepasBuildingRepository.getWirepasBuildingById(id).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasBuildingWithSiteById(id: string): Promise<WirepasBuilding> {
    try {
      return this.wirepasBuildingRepository.getWirepasBuildingWithSiteById(id).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBuilding(siteId: CommonDTOs.FilterParam): Promise<WirepasBuilding[]> {
    try {
      return this.wirepasBuildingRepository.getBuilding(siteId).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFirstBuilding(): Promise<WirepasBuilding> {
    try {
      return this.wirepasBuildingRepository.getAllWirepasBuildings().getOne();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasBuildingForBulkImport(wirepasBuildingsData: WirepasBuildingDtos.GetWirepasBuildingForBulkImportDto[]): Promise<WirepasBuilding[]> {
    try {
      return this.wirepasBuildingRepository.getWirepasBuildingForBulkImport(wirepasBuildingsData).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWntBuildings(user: WntAuthenticationInput): Promise<WirepasBuildingDtos.WntBuildingInterface[]> {
    try {
      const wntGetBuildingFormat = getWntGetBuildingFormat();
      const response = (await this.wntGatewayService.handleSendRequest(wntGetBuildingFormat, user, WntServiceType.BUILDING)) as WntBuildingReponse;
      const buildings = response.data.buildings;
      return buildings as WirepasBuildingDtos.WntBuildingInterface[];
    } catch (error) {
      throw new Error(error);
    }
  }
}
