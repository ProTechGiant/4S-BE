import dotenv from "dotenv";
import websocket from "websocket";
import { WntServiceType } from "./enum/wnt-gateway.enum";
import { InternalServerErrorException, NotFoundException } from "../errors/exceptions";
import { WntAuthenticationInput, ParsedAuthenticationResponse } from "./interface/wnt-gateway.interface";
import { ImageResponse, WntAreaResponse, WntBuildingReponse, WntFloorLevelResponse, WntGetUsersReponse, WntUserReponse } from "./interface/reponse.interface";

dotenv.config();

const WebSocketClient = websocket.client;

type Connection = websocket.connection;
type WebSocketClientInstance = InstanceType<typeof WebSocketClient>;

export class WntGatewayService {
  private socket: WebSocketClientInstance;

  constructor() {
    this.socket = new WebSocketClient();
  }

  private async handleConnection(host: string): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      this.socket.connect(host, "echo-protocol");
      this.socket.on("connect", (data) => {
        resolve(data);
      });
      this.socket.on("connectFailed", (error) => {
        this.onError(error);
        reject(error);
      });
    });
  }

  private onError(error: Error) {
    throw new InternalServerErrorException(error.message);
  }

  private async onAuthentication(username: string, password: string, connection: Connection): Promise<ParsedAuthenticationResponse> {
    return new Promise<ParsedAuthenticationResponse>(async (resolve) => {
      const credentials = {
        data: { username, password },
        type: 1,
        version: 5,
      };

      connection.send(JSON.stringify(credentials));

      connection.on("message", (result: any) => resolve(JSON.parse(result.utf8Data)));
    });
  }

  public async handleSendRequest(message: WntInputType, userCredentials: WntAuthenticationInput, service: WntServiceType) {
    return new Promise(async (resolve, reject) => {
      try {
        let connection = await this.handleConnection(process.env.WNT_AUTH_SERVER);
        const data = await this.onAuthentication(userCredentials.email, userCredentials.password, connection);
        if (!data.data.session_id) throw new NotFoundException("Unable to create session");
        message.session_id = data.data.session_id;

        if (service !== WntServiceType.USER) {
          connection = await this.handleConnection(process.env.WNT_META_SERVER);
        }

        connection.send(JSON.stringify(message));

        connection.on("message", async (result: any) => {
          const parseData = await JSON.parse(result.utf8Data);
          switch (service) {
            case WntServiceType.USER:
              resolve(parseData as WntUserReponse | WntGetUsersReponse);
              break;
            case WntServiceType.BUILDING:
              resolve(parseData as WntBuildingReponse);
              break;
            case WntServiceType.FLOORLEVEL:
              resolve(parseData as WntFloorLevelResponse);
              break;
            case WntServiceType.AREA:
              resolve(parseData as WntAreaResponse);
              break;
            case WntServiceType.FLOORLEVEL_IMAGE:
              resolve(parseData as ImageResponse);
              break;
            default:
              throw new Error("Invalid service specified");
          }
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  }
}

interface WntInputType {
  type: number;
  version: number;
  data: any;
  session_id?: string;
}
