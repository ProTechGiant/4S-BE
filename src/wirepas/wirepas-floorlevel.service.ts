import { BaseService } from "../base/base.service";
import { CommonDTOs } from "../common/dto";
import { NoRecordFoundException, NotFoundException } from "../errors/exceptions";
import { WntAuthenticationInput } from "../sockets/interface/wnt-gateway.interface";
import { WntGatewayService } from "../sockets/wnt-gateway.service";
import { WirepasFloorlevelDtos } from "./dto/wirepas-floorlevel.dto";
import { WirepasFloorlevel } from "./entity/wirepass-floorlevel.entity";
import { WirepasBuildingService } from "./wirepas-building.service";
import { WirepasFloorlevelRepository } from "./wirepas-floorlevel.repository";
import sizeOf from "image-size";
import fs from "fs";
import { WirepasBuilding } from "./entity/wirepas-building.entity";
import {
  getWntFLoorlevelByBuildingIdFormat,
  getInputForCreateWntFloorLevel,
  getInputForDeleteWntFloorLevel,
  getInputForImageUpdateWntFloorLevel,
  getInputForUpdateWntFloorLevel,
  getInputForUploadImageOnWnt,
  getWntFloorlevelImageFormate,
} from "./utils/wirepas-floorlevel.generator";
import { WntServiceType } from "../sockets/enum/wnt-gateway.enum";
import { ImageResponse, WntFloorLevelResponse, ImageData } from "../sockets/interface/reponse.interface";
import { TransactionScope } from "../base/transactionScope";
import { SocketServer } from "../socket.server";
import { redisConnection } from "../redis";
import { tokenDecoder } from "../common/utils/assign-and-decode-token";
import { JsonToObject } from "../common/utils/json-to-object";
import { SiteService } from "../site/site.service";

export class WirepasFloorlevelService extends BaseService {
  private readonly wirepasFloorlevelRepository: WirepasFloorlevelRepository;
  private readonly wirepasBuildingService: WirepasBuildingService;
  private readonly wntGatewayService: WntGatewayService;
  private readonly siteService: SiteService;

  constructor() {
    super();
    this.wirepasFloorlevelRepository = new WirepasFloorlevelRepository();
    this.wntGatewayService = new WntGatewayService();
    this.wirepasBuildingService = new WirepasBuildingService();
    this.siteService = new SiteService();
  }

  async getWirepasFloorlevel(params: CommonDTOs.FilterParam): Promise<WirepasFloorlevel[]> {
    try {
      return await this.wirepasFloorlevelRepository.getWirepasFloorlevel(params).getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWirepasFloorlevelWithJoins(floorlevelId: string): Promise<WirepasFloorlevel> {
    try {
      return await this.wirepasFloorlevelRepository.getWirepasFloorlevelWithJoins(floorlevelId).getOne();
    } catch (error) {
      throw new Error(error);
    }
  }
  async getWirepasFloorlevelByBuilding(buildingId: string, input: WirepasFloorlevelDtos.GetFloorlevelDto): Promise<{ data: WirepasFloorlevel[] | unknown[]; totalRecord: number }> {
    try {
      const filterInput = JsonToObject(input.filterInputString);
      const site = await this.siteService.getSiteById(input.siteId);
      if (!site) throw new NotFoundException("Invalid Site specification");
      const floorlevels = await this.wirepasFloorlevelRepository.getWirepasFloorlevelByBuilding(buildingId, filterInput, input).getManyAndCount();
      return { data: floorlevels[0], totalRecord: floorlevels[1] };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllWirepasFloorlevel(): Promise<WirepasFloorlevel[]> {
    try {
      const floorlevels = await this.wirepasFloorlevelRepository.getWirepasFloorlevel().getMany();
      return floorlevels;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createWirepasFloorlevel(input: WirepasFloorlevelDtos.CreateWirepasFloorlevelDto, currentUser: CommonDTOs.CurrentUser): Promise<WirepasFloorlevel> {
    try {
      const wirepasFloorlevel = new WirepasFloorlevel();
      const transactionScope = this.getTransactionScope();

      const wirepasBuilding = await this.wirepasBuildingService.getWirepasBuildingById(input.wirepasBuildingId);
      if (!wirepasBuilding) throw new NotFoundException("Invalid Building specification");

      /* ************ WntGateway ************ */
      const createWntFloorlevelFormat = getInputForCreateWntFloorLevel(input);
      const wirepasMessage = ((await this.wntGatewayService.handleSendRequest(createWntFloorlevelFormat, { email: "admin", password: "hdMY3IY2OVtdKcbqBeZp5s4n" }, WntServiceType.FLOORLEVEL)) as WntFloorLevelResponse).data.buildings[0].floor_plans[0];
      /* ************ WntGateway ************ */

      wirepasFloorlevel.name = input.name;
      wirepasFloorlevel.level = input.level;
      wirepasFloorlevel.wirepasBuilding = wirepasBuilding;
      wirepasFloorlevel.assetCount = 0;
      wirepasFloorlevel.sensorCount = 0;
      wirepasFloorlevel.id = wirepasMessage.id;
      wirepasFloorlevel.gatewayNetworkAddress = wirepasMessage.id;
      wirepasFloorlevel.altitudeLeftbottom = wirepasMessage.altitude_leftbottom;
      wirepasFloorlevel.altitudeLefttop = wirepasMessage.altitude_righttop;
      wirepasFloorlevel.altitudeRightbottom = wirepasMessage.altitude_rightbottom;
      wirepasFloorlevel.altitudeRighttop = wirepasMessage.altitude_righttop;
      wirepasFloorlevel.distanceInM = wirepasMessage.distance_in_m;
      wirepasFloorlevel.latitudeLeftbottom = wirepasMessage.latitude_leftbottom;
      wirepasFloorlevel.latitudeLefttop = wirepasMessage.latitude_lefttop;
      wirepasFloorlevel.latitudeRightbottom = wirepasMessage.latitude_rightbottom;
      wirepasFloorlevel.latitudeRighttop = wirepasMessage.latitude_righttop;
      wirepasFloorlevel.longitudeLeftbottom = wirepasMessage.longitude_leftbottom;
      wirepasFloorlevel.longitudeLefttop = wirepasMessage.longitude_lefttop;
      wirepasFloorlevel.longitudeRightbottom = wirepasMessage.longitude_rightbottom;
      wirepasFloorlevel.longitudeRighttop = wirepasMessage.longitude_righttop;
      wirepasFloorlevel.xDistancePoint1 = wirepasMessage.x_distance_point1;
      wirepasFloorlevel.xDistancePoint2 = wirepasMessage.x_distance_point2;
      wirepasFloorlevel.xNormcoordLeftbottom = wirepasMessage.x_normcoord_leftbottom;
      wirepasFloorlevel.xNormcoordLefttop = wirepasMessage.x_normcoord_lefttop;
      wirepasFloorlevel.xNormcoordRighttop = wirepasMessage.x_normcoord_righttop;
      wirepasFloorlevel.xNormcoordRightbottom = wirepasMessage.x_normcoord_rightbottom;
      wirepasFloorlevel.yDistancePoint1 = wirepasMessage.y_distance_point1;
      wirepasFloorlevel.yDistancePoint2 = wirepasMessage.y_distance_point2;
      wirepasFloorlevel.yNormcoordLeftbottom = wirepasMessage.y_normcoord_leftbottom;
      wirepasFloorlevel.yNormcoordLefttop = wirepasMessage.y_normcoord_lefttop;
      wirepasFloorlevel.yNormcoordRightbottom = wirepasMessage.y_normcoord_rightbottom;
      wirepasFloorlevel.yNormcoordRighttop = wirepasMessage.y_normcoord_righttop;

      transactionScope.add(wirepasFloorlevel);
      await transactionScope.commit();
      return wirepasFloorlevel;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteWirepasFloorlevel(params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser, tScope?: TransactionScope): Promise<CommonDTOs.MessageResponse> {
    try {
      const transactionScope = tScope ?? this.getTransactionScope();

      const wirepasFloorlevels = await this.getWirepasFloorlevel(params);
      if (!tScope && !wirepasFloorlevels.length) throw new NoRecordFoundException("Invalid floorlevel specified");

      /* ************ WntGateway ************ */
      for (const wirepasFloorlevel of wirepasFloorlevels) {
        wirepasFloorlevel.currentUser = currentUser;
        wirepasFloorlevel.transactionScope = transactionScope;
        const wntFloorlevelDeleteInput = getInputForDeleteWntFloorLevel(wirepasFloorlevel.id);
        await this.wntGatewayService.handleSendRequest(wntFloorlevelDeleteInput, currentUser as WntAuthenticationInput, WntServiceType.FLOORLEVEL);
      } /* ************ WntGateway ************ */

      transactionScope.deleteCollection(wirepasFloorlevels);
      if (!tScope) await transactionScope.commit();

      return { message: "Floor Level deleted" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadWirepasFloorlevelImage(params: CommonDTOs.FilterParam, image: CommonDTOs.CommonFileType, currentUser: CommonDTOs.CurrentUser): Promise<WirepasFloorlevel> {
    try {
      const transactionScope = this.getTransactionScope();
      const [wirepasFloorlevel] = await this.getWirepasFloorlevel(params);
      if (!wirepasFloorlevel) throw new NoRecordFoundException("Invalid Floorlevel specified");

      const data = fs.readFileSync(image.path);
      const imageInBase64 = Buffer.from(data).toString("base64");
      const dimensions = sizeOf(data);

      const uploadWntFloorlevelImageFormat = getInputForUploadImageOnWnt(imageInBase64);
      const wirepasImageUploadResponse = ((await this.wntGatewayService.handleSendRequest(uploadWntFloorlevelImageFormat, currentUser as WntAuthenticationInput, WntServiceType.FLOORLEVEL)) as any).data;

      const wntInput: WirepasFloorlevelDtos.WntFloorlevelUpdateInputType = {
        imageHeight: dimensions.height,
        imageWidth: dimensions.width,
        imageId: wirepasImageUploadResponse.image_id,
        wirepasBuildingId: wirepasFloorlevel.wirepasBuilding.id,
      };
      const updateWirepasFloorlevelFormat = getInputForImageUpdateWntFloorLevel(wntInput, params.id as string);
      await this.wntGatewayService.handleSendRequest(updateWirepasFloorlevelFormat, currentUser as WntAuthenticationInput, WntServiceType.FLOORLEVEL);

      wirepasFloorlevel.floorplanImageUrl = `${process.env.CLIENT_API_BASE_URL}/public/images/${image.originalname}`;
      wirepasFloorlevel.floorplanImage = Buffer.from(image.path);
      wirepasFloorlevel.floorplanImageId = wirepasImageUploadResponse.image_id;
      wirepasFloorlevel.imageHeight = dimensions.height;
      wirepasFloorlevel.imageWidth = dimensions.width;

      transactionScope.update(wirepasFloorlevel);
      await transactionScope.commit();
      return wirepasFloorlevel;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateWirepasFloorlevel(input: WirepasFloorlevelDtos.UpdateWirepasFloorlevelDto, params: CommonDTOs.FilterParam, currentUser: CommonDTOs.CurrentUser): Promise<WirepasFloorlevel> {
    try {
      const transactionScope = this.getTransactionScope();
      let wirepasBuilding: WirepasBuilding;
      const [wirepasFloorlevel] = await this.getWirepasFloorlevel(params);
      if (!wirepasFloorlevel) {
        throw new NoRecordFoundException("Invalid Floorlevel specified");
      }

      if (input.wirepasBuildingId) {
        wirepasBuilding = await this.wirepasBuildingService.getWirepasBuildingById(input.wirepasBuildingId);
        if (!wirepasBuilding) throw new NotFoundException("Invalid Building specification");
      }

      await this.updateWirepasFloorlevelInGateway(input, currentUser, params.id as string);

      const updatedWirepasFloorlevel = this.updateWirepasFloorlevelFields(wirepasFloorlevel, input, wirepasBuilding);

      transactionScope.update(updatedWirepasFloorlevel);
      await transactionScope.commit();
      return wirepasFloorlevel;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateWirepasFloorlevelInGateway(input: WirepasFloorlevelDtos.UpdateWirepasFloorlevelDto, currentUser: CommonDTOs.CurrentUser, wirepasFloorLevelId: string) {
    const updateWirepasFloorlevelFormat = getInputForUpdateWntFloorLevel(input, wirepasFloorLevelId);

    await this.wntGatewayService.handleSendRequest(updateWirepasFloorlevelFormat, currentUser as WntAuthenticationInput, WntServiceType.FLOORLEVEL);
  }

  updateWirepasFloorlevelFields(wirepasFloorlevel: WirepasFloorlevel, input: WirepasFloorlevelDtos.UpdateWirepasFloorlevelDto, wirepasBuilding: WirepasBuilding): WirepasFloorlevel {
    if (input.name) wirepasFloorlevel.name = input.name;
    if (input.level) wirepasFloorlevel.level = input.level;
    if (input.wirepasBuildingId) wirepasFloorlevel.wirepasBuilding = wirepasBuilding;
    if (input.altitudeLeftbottom) wirepasFloorlevel.altitudeLeftbottom = input.altitudeLeftbottom;
    if (input.altitudeLefttop) wirepasFloorlevel.altitudeLefttop = input.altitudeLefttop;
    if (input.altitudeRightbottom) wirepasFloorlevel.altitudeRightbottom = input.altitudeRightbottom;
    if (input.altitudeRighttop) wirepasFloorlevel.altitudeRighttop = input.altitudeRighttop;
    if (input.distanceInM) wirepasFloorlevel.distanceInM = input.distanceInM;
    if (input.latitudeLeftbottom) wirepasFloorlevel.latitudeLeftbottom = input.latitudeLeftbottom;
    if (input.latitudeLefttop) wirepasFloorlevel.latitudeLefttop = input.latitudeLefttop;
    if (input.latitudeRightbottom) wirepasFloorlevel.latitudeRightbottom = input.latitudeRightbottom;
    if (input.latitudeRighttop) wirepasFloorlevel.latitudeRighttop = input.latitudeRighttop;
    if (input.longitudeLeftbottom) wirepasFloorlevel.longitudeLeftbottom = input.longitudeLeftbottom;
    if (input.longitudeLefttop) wirepasFloorlevel.longitudeLefttop = input.longitudeLefttop;
    if (input.longitudeRightbottom) wirepasFloorlevel.longitudeRightbottom = input.longitudeRightbottom;
    if (input.longitudeRighttop) wirepasFloorlevel.longitudeRighttop = input.longitudeRighttop;
    if (input.xDistancePoint1) wirepasFloorlevel.xDistancePoint1 = input.xDistancePoint1;
    if (input.xDistancePoint2) wirepasFloorlevel.xDistancePoint2 = input.xDistancePoint2;
    if (input.xNormcoordLeftbottom) wirepasFloorlevel.xNormcoordLeftbottom = input.xNormcoordLeftbottom;
    if (input.xNormcoordLefttop) wirepasFloorlevel.xNormcoordLefttop = input.xNormcoordLefttop;
    if (input.xNormcoordRighttop) wirepasFloorlevel.xNormcoordRighttop = input.xNormcoordRighttop;
    if (input.xNormcoordRightbottom) wirepasFloorlevel.xNormcoordRightbottom = input.xNormcoordRightbottom;
    if (input.yDistancePoint1) wirepasFloorlevel.yDistancePoint1 = input.yDistancePoint1;
    if (input.yDistancePoint2) wirepasFloorlevel.yDistancePoint2 = input.yDistancePoint2;
    if (input.yNormcoordLeftbottom) wirepasFloorlevel.yNormcoordLeftbottom = input.yNormcoordLeftbottom;
    if (input.yNormcoordLefttop) wirepasFloorlevel.yNormcoordLefttop = input.yNormcoordLefttop;
    if (input.yNormcoordRightbottom) wirepasFloorlevel.yNormcoordRightbottom = input.yNormcoordRightbottom;
    if (input.yNormcoordRighttop) wirepasFloorlevel.yNormcoordRighttop = input.yNormcoordRighttop;
    return wirepasFloorlevel;
  }

  async getWntFloorlevelByBuildingId(buildingId: string, wntUser: WntAuthenticationInput) {
    try {
      const wntGetBuildingFormat = getWntFLoorlevelByBuildingIdFormat(buildingId);
      const response = (await this.wntGatewayService.handleSendRequest(wntGetBuildingFormat, wntUser, WntServiceType.FLOORLEVEL)) as WntFloorLevelResponse;
      const floorlevels = response.data.buildings[0];
      return floorlevels;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWntFloorlevelImage(imageId: string, wntUser: WntAuthenticationInput): Promise<ImageData> {
    try {
      const wntGetFloorlevelImageFormat = getWntFloorlevelImageFormate(imageId);
      const response = (await this.wntGatewayService.handleSendRequest(wntGetFloorlevelImageFormat, wntUser, WntServiceType.FLOORLEVEL_IMAGE)) as ImageResponse;
      const image = response.data;
      return image;
    } catch (error) {
      throw new Error(error);
    }
  }

  async storeUserIdInRedis(input: WirepasFloorlevelDtos.StoreUserIdInRedis) {
    try {
      const socketIO = SocketServer.getInstance(null);
      const user = tokenDecoder(input.token);
      const storedFloorlevelData = await redisConnection.get(`userListByFloorlevelId:${input.wirepasFloorlevelId}`);
      let redis: string;
      if (!storedFloorlevelData) {
        redis = await redisConnection.set(`userListByFloorlevelId:${input.wirepasFloorlevelId}`, [user.id]);
        socketIO.sendMessage("floorInSuccess", user.id, redis);
      } else {
        const userIndex = storedFloorlevelData.indexOf(user.id);
        if (userIndex === -1) {
          const updatedData = [...storedFloorlevelData, user.id];
          redis = await redisConnection.set(`userListByFloorlevelId:${input.wirepasFloorlevelId}`, updatedData);
          socketIO.sendMessage("floorInUpdate", user.id, redis);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserInRedis(input: any): Promise<{ floorLevelId: string; users: string[] }[]> {
    try {
      const wirepasFloorlevelIds = [...new Set(input.nodes.map((node: any) => node.floor_plan_id))];
      let userListData = [];
      for (let i = 0; i < wirepasFloorlevelIds.length; i++) {
        const storedFloorlevelData = await redisConnection.get(`userListByFloorlevelId:${wirepasFloorlevelIds[i]}`);
        if (storedFloorlevelData) userListData.push({ floorLevelId: wirepasFloorlevelIds[i], users: storedFloorlevelData });
      }
      return userListData;
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeUserIdFromRedis(input: WirepasFloorlevelDtos.StoreUserIdInRedis) {
    try {
      const socketIO = SocketServer.getInstance(null);
      const user = tokenDecoder(input.token);
      const storedFloorlevelData = await redisConnection.get(`wirepasFloorlevel:${input.wirepasFloorlevelId}`);
      if (storedFloorlevelData) {
        const userIndex = storedFloorlevelData.indexOf(user.id);
        if (userIndex > -1) {
          storedFloorlevelData.splice(userIndex, 1);
          const redis = await redisConnection.set(`wirepasFloorlevel:${input.wirepasFloorlevelId}`, storedFloorlevelData);
          socketIO.sendMessage("floorOutResponse", user.id, redis);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
