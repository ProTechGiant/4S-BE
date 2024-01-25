import websocket, { connection as WebSocketConnection } from "websocket";
import mqtt, { MqttClient } from "mqtt";
import { logger } from "./logger";
import { SensorService } from "./sensor/sensor.service";
import { SensorProtocolTypes } from "./sensor/enum/sensor.enum";
import { WirepasFloorlevelService } from "./wirepas/wirepas-floorlevel.service";
import { SocketServer } from "./socket.server";
import { WirepasSensorService } from "./wirepas/wirepas-sensor.service";
const sensorService = new SensorService();
const wirepasSensorService = new WirepasSensorService();
const wirepasFloorlevelService = new WirepasFloorlevelService();
const mqttHost = process.env.WNT_WEB_SOCKET_MQTT_SERVER;
const connectionOptions = {
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  rejectUnauthorized: false,
};

const mqttClient: MqttClient = mqtt.connect(mqttHost, connectionOptions);
mqttClient.on("connect", () => {
  logger("Connected to MQTT server");
  if (mqttClient) {
    mqttClient.subscribe("node_data_json");
  }
});

mqttClient.on("message", (_o, message) => {
  handleForMessage(message);
});

mqttClient.on("error", (error) => {
  logger("Client disconnected due to error: " + error, "error");
  mqttClient.end();
});
mqttClient.on("reconnect", () => {
  logger("client reconnect...", "warning");
});

const handleForMessage = async (message): Promise<void> => {
  const socket = JSON.parse(message.toString());
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..", socket);

  await sensorService.createSensorIfNotExist(JSON.parse(message.toString()), SensorProtocolTypes.WIREPAS);
  const redisUsers = await wirepasFloorlevelService.getUserInRedis(socket);

  const socketIo = SocketServer.getInstance(null);
  if (redisUsers.length > 0) {
    for (const redisUser of redisUsers) {
      const wirepasSensorWithFloorlevel = await wirepasSensorService.getWirepasSensorByFloorlevelWithJoins(redisUser.floorLevelId, true);
      socketIo.broadcastMessage("SensorWithFloorlevel", redisUser.users, wirepasSensorWithFloorlevel);
    }
  }
  const WebSocketClient = websocket.client;
  const csClientBackend = new WebSocketClient();
  csClientBackend.on("connect", (connection: WebSocketConnection) => {
    connection.send(
      JSON.stringify({
        type: "real_time_data",
        token: process.env.CS_IOTGATEWAY_SUBCRIBER_TOKEN,
        data: message.toString(),
      })
    );

    connection.on("error", (error) => logger(error.message, "error"));
  });
};

export default mqttClient;
