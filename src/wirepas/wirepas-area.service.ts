import { AreaDtos } from "../area/dto/area.dto";
import { Area } from "../area/entity/area.entity";
import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { CommonDTOs } from "../common/dto";
import { NoRecordFoundException, NotFoundException } from "../errors/exceptions";
import { SensorProtocolTypes } from "../sensor/enum/sensor.enum";
import { WntServiceType } from "../sockets/enum/wnt-gateway.enum";
import { WntAreaResponse } from "../sockets/interface/reponse.interface";
import { WntAuthenticationInput } from "../sockets/interface/wnt-gateway.interface";
import { WntGatewayService } from "../sockets/wnt-gateway.service";
import { WirepasArea } from "./entity/wirepas-area.entity";
import { WirepasFloorlevel } from "./entity/wirepass-floorlevel.entity";
import { WntActionState, getWirepasAreaFormat, getWirepasAreaFormatForDelete, getWirepasAreaFormatForGet, getWirepasAreaFormatForUpdate } from "./utils/wirepas-area.generator";
import { WirepasAreaRepository } from "./wirepas-area.repository";
import { WirepasFloorlevelService } from "./wirepas-floorlevel.service";

export class WirepasAreaService extends BaseService {
  private readonly wirepasAreaRepository: WirepasAreaRepository;
  private readonly wirepasFloorlevelService: WirepasFloorlevelService;
  private readonly wntGatewayService: WntGatewayService;

  constructor() {
    super();
    this.wirepasAreaRepository = new WirepasAreaRepository();
    this.wirepasFloorlevelService = new WirepasFloorlevelService();
    this.wntGatewayService = new WntGatewayService();
  }

  async createWirepasArea(input: AreaDtos.CreateAreaInputData, area: Area, currentUser: CommonDTOs.CurrentUser, transactionScope: TransactionScope): Promise<WirepasArea> {
    try {
      const wirepasArea = new WirepasArea();

      const [wirepasFloorlevel] = await this.wirepasFloorlevelService.getWirepasFloorlevel({ id: input.wirepasFloorlevelId });
      if (!wirepasFloorlevel) throw new NotFoundException("Invalid floor level specified");

      /* ************ WntGateway ************ */
      const wirepasAreaJson = getWirepasAreaFormat(input, WntActionState.AREA_CREATE);
      const wirepasAreaGateway = ((await this.wntGatewayService.handleSendRequest(wirepasAreaJson, currentUser as WntAuthenticationInput, WntServiceType.AREA)) as WntAreaResponse).data.buildings[0].floor_plans[0].areas[0];
      /* ************ WntGateway ************ */

      wirepasArea.id = wirepasAreaGateway.id;
      wirepasArea.area = area;
      wirepasArea.wirepasFloorlevel = wirepasFloorlevel;
      transactionScope.add(wirepasArea);
      return wirepasArea;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateWirepasArea(input: AreaDtos.UpdateAreaDto, area: Area, params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser, transactionScope: TransactionScope): Promise<WirepasArea> {
    try {
      const [wirepasArea] = await this.getWirepasArea(params);
      let wirepasFloorlevel: WirepasFloorlevel;

      if (input.wirepasFloorlevelId) {
        [wirepasFloorlevel] = await this.wirepasFloorlevelService.getWirepasFloorlevel({ id: input.wirepasFloorlevelId });
        if (!wirepasFloorlevel) throw new NotFoundException("Invalid floor level specified");
      }

      /* ************ WntGateway ************ */
      const wirepasAreaJson = getWirepasAreaFormatForUpdate(area, WntActionState.AREA_UPDATE, wirepasArea.id, wirepasArea.wirepasFloorlevel.id);
      await this.wntGatewayService.handleSendRequest(wirepasAreaJson, currentUser as WntAuthenticationInput, WntServiceType.AREA);
      /* ************ WntGateway ************ */

      if (input.wirepasFloorlevelId) wirepasArea.wirepasFloorlevel = wirepasFloorlevel;

      transactionScope.update(wirepasArea);
      return wirepasArea;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteWirepasArea(params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();

      const wirepasAreas = await this.getWirepasArea(params);
      if (!tScope && !wirepasAreas.length) throw new NoRecordFoundException("Invalid wirepas area specified");

      for (const wirepasArea of wirepasAreas) {
        wirepasArea.transactionScope = transactionScope;
        const wntInput = getWirepasAreaFormatForDelete(wirepasArea.id, wirepasArea.wirepasFloorlevel.id, WntActionState.AREA_DELETE);
        await this.wntGatewayService.handleSendRequest(wntInput, currentUser as WntAuthenticationInput, WntServiceType.AREA);
      }

      transactionScope.deleteCollection(wirepasAreas);
      if (!tScope) await transactionScope.commit();

      return { message: "Area deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasArea(params: CommonDTOs.FilterParam): Promise<WirepasArea[]> {
    try {
      return this.wirepasAreaRepository.getWirepasArea(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasAreaByIdz(idz: string[]): Promise<WirepasArea[]> {
    try {
      return this.wirepasAreaRepository.getWirepasAreaByIdz(idz).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWntAreaByFloorlevelId(floorlevelId: string, wntUser: WntAuthenticationInput) {
    try {
      const wntGetFloorlevelFormat = getWirepasAreaFormatForGet(floorlevelId);
      const response = (await this.wntGatewayService.handleSendRequest(wntGetFloorlevelFormat, wntUser, WntServiceType.AREA)) as WntAreaResponse;
      const areas = response.data.buildings[0].floor_plans[0].areas;
      return areas;
    } catch (error) {
      throw new Error(error);
    }
  }
}
