import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
  private static instance: SocketService | null = null;
  private io: Server;

  constructor(app: HttpServer) {
    this.io = new Server(app, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket: Socket) => {
      socket.on("disconnect", () => {
        console.log("Socket.io a Client disconnected");
      });
    });
  }

  static getInstance(app: HttpServer): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(app);
    }

    return SocketService.instance;
  }

  sendMessage(type: string, message: any): void {
    //
    this.io.emit(type, message);
  }
}

export default SocketService;
