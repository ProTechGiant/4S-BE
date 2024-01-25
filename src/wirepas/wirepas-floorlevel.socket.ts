import { Socket, Server } from "socket.io";
import { EVENTS } from "../socket.server";
import { WirepasFloorlevelService } from "./wirepas-floorlevel.service";

export class WirepasFloorlevelSocket {
  private readonly wirepasFloorlevelService: WirepasFloorlevelService;

  constructor(private readonly io: Server) {
    this.wirepasFloorlevelService = new WirepasFloorlevelService();
    this.initializeSocket();
  }

  private initializeSocket() {
    this.io.on("connection", (socket: Socket) => {
      console.log("WirepasFloorlevelSocket: Client connected");

      socket.on(EVENTS.FLOOR_IN, (input: string) => {
        this.wirepasFloorlevelService.storeUserIdInRedis(JSON.parse(input));
      });

      socket.on(EVENTS.FLOOR_OUT, (input: string) => {
        this.wirepasFloorlevelService.removeUserIdFromRedis(JSON.parse(input));
      });
    });
  }
}
