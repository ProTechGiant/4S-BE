import dotenv from "dotenv";
import mqttClient from "./mqtt.connector";
dotenv.config();

export class GatewayFactory {
  static create() {
    return mqttClient;
  }
}
