import { NotAcceptableException } from "./errors/exceptions";
import { getTypeormConfig } from "./connection.options";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { UserService } from "./user/user.service";
import { DEFAULT_DATABASE } from "./common/constants";
import { logger } from "./logger";
import { execSync } from "child_process";

const migartionScript = "migration:run";
const seederScript = "seeder:run";

export class TestServer {
  private readonly userService: UserService;
  private dbName: string;
  private connectionOptions: ConnectionOptions;
  private connection: Connection;
  public authToken: string;

  constructor() {
    this.userService = new UserService();
  }

  async loadConnectionOptions() {
    this.connectionOptions = await getTypeormConfig();
    this.dbName = this.connectionOptions.database as string;
  }

  async createDB() {
    const dbName = DEFAULT_DATABASE as any;
    const tempConnection = await createConnection({
      ...this.connectionOptions,
      database: dbName,
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${this.dbName}`);
    await tempConnection.close();
  }

  async connectToDatabase() {
    try {
      this.connection = await createConnection(this.connectionOptions);
      if (this.connection?.isConnected) logger("-------Connected to database-------");
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }

  async runMigrations() {
    execSync(`npm run ${migartionScript} && npm run ${seederScript}`);
  }

  async dropDatabase() {
    if (this.connection.isConnected) {
      await this.connection.dropDatabase();
    }
  }

  isRunning(): boolean {
    return this.connection?.isConnected;
  }

  async disconnectFromDb() {
    if (this.connection.isConnected) {
      await this.connection.close();
    }
  }

  async retrieveToken() {
    const input = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    };
    const { token } = await this.userService.loginUser(input);
    this.authToken = token;
  }

  async setup() {
    await this.loadConnectionOptions();
    await this.createDB();
    await this.connectToDatabase();
    await this.runMigrations();
    await this.retrieveToken();
  }

  async teardown() {
    await this.dropDatabase();
    await this.disconnectFromDb();
  }
}
