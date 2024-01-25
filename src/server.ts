import http from "http";
import { connectionToDatabase } from "./connection.options";
import app from ".";
import "./types";
import { logger } from "./logger";
import { GatewayFactory } from "./gateway-factory";
import { SocketServer } from "./socket.server";

const port = process.env.PORT;
const server = http.createServer(app);
const _ = new SocketServer(server);
GatewayFactory.create();

connectionToDatabase(() => {
  server.listen(port, async () => {
    logger(`Server running on http://127.0.0.1:${port}`);
    logger(`Swagger docx available on http://127.0.0.1:${port}/v1/api`);
  });
});
