import { Server, Socket } from "socket.io";
import { UserService } from "./user/user.service";
import { TokenInterface, tokenDecoder } from "./common/utils/assign-and-decode-token";
import { WirepasFloorlevelSocket } from "./wirepas/wirepas-floorlevel.socket";
import { Server as HttpServer } from "http";
import { logger } from "./logger";

const CORS_CONFIG = {
  origin: "*",
  methods: ["GET", "POST"],
};

export interface SocketUserInterface {
  user: TokenInterface;
  socketId: string;
}

export const EVENTS = {
  LOGIN: "login",
  FLOOR_IN: "floorIn",
  FLOOR_OUT: "floorOut",
  DISCONNECT: "disconnect",
  LOGIN_SUCCESS: "loginSuccess",
};

export class SocketServer {
  private readonly io: Server;
  static instance: SocketServer | null = null;
  userSocketData: Record<string, SocketUserInterface> = {};
  private readonly userService: UserService;

  constructor(app: Express.Application) {
    this.userService = new UserService();
    this.io = new Server(app, {
      cors: CORS_CONFIG,
    });

    // Initialize other socket-related components
    const _ = new WirepasFloorlevelSocket(this.io);

    this.io.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket) {
    logger("Socket.io client connected");

    socket.on(EVENTS.LOGIN, this.handleLogin.bind(this, socket));

    socket.on(EVENTS.DISCONNECT, this.handleDisconnect.bind(this, socket));
  }

  private async handleLogin(socket: Socket, userCredentials: string) {
    try {
      const user = await this.loginUser(userCredentials, socket.id);

      this.sendMessage(EVENTS.LOGIN_SUCCESS, user.id, user);
    } catch (error) {
      console.error(error.message);
    }
  }

  private handleDisconnect(socket: Socket) {
    if (socket) {
      delete this.userSocketData[socket.id];
    }
  }

  private async loginUser(userCredentials: string, socketId: string): Promise<TokenInterface> {
    try {
      const token = await this.userService.loginUser(JSON.parse(userCredentials));
      const user = tokenDecoder(token.token);
      if (socketId && !this.userSocketData.hasOwnProperty(user.id)) {
        SocketServer.instance.userSocketData[user.id] = { user, socketId };
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  sendMessage(event: string, userId: string, message: any) {
    if (SocketServer.instance.userSocketData[userId]) {
      const socketId = SocketServer.instance.userSocketData[userId].socketId;
      this.io.to(socketId).emit(event, message);
    }
  }

  public async broadcastMessage(event: string, userIds: string[], message: any) {
    try {
      for (const userId of userIds) {
        this.sendMessage(event, userId, message);
      }
      console.log("Message broadcast successful.");
    } catch (error) {
      console.error("Error broadcasting message:", error);
      throw new Error("Failed to broadcast message.");
    }
  }

  static getInstance(app: HttpServer): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer(app);
    }
    return SocketServer.instance;
  }
}
