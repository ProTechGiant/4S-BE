import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { NotImplementedException } from "../errors/exceptions";
import { DBTypes } from "./enum/database.enum";
import { DbConfig } from "./interface/database.interface";

export class DatabaseService {
  private static async getConnectionOptions(
    dbConfig: DbConfig
  ): Promise<ConnectionOptions> {
    let connectionOptions: ConnectionOptions;
    switch (process.env.DB_TYPE) {
      case DBTypes.POSTGRES:
        connectionOptions = this.getTypeOrmModuleOptions();
        break;
      default:
        throw new NotImplementedException(
          `Database type '${process.env.DB_TYPE}' not supported`
        );
    }

    return {
      ...connectionOptions,
      entities: dbConfig?.entities,
      synchronize: dbConfig?.synchronize,
      logging: dbConfig?.logging,
      migrations: dbConfig?.migrations,
      cli: { migrationsDir: dbConfig.migrationsDir },
    };
  }

  private static getTypeOrmModuleOptions(): ConnectionOptions {
    return {
      type: process.env.DB_TYPE as DBTypes,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      ssl: { rejectUnauthorized: false },
      password: process.env.DB_PASSWORD,
      database:
        process.env.IS_TEST === "false"
          ? process.env.DATABASE
          : process.env.TEST_DATABASE,
    };
  }

  public static async getTypeOrmConfig(
    dbConfig: DbConfig
  ): Promise<ConnectionOptions> {
    const connectionOptions = await this.getConnectionOptions(dbConfig);
    return connectionOptions;
  }

  public static async forRoot(dbConfig: DbConfig): Promise<boolean> {
    const connectionOptions = await this.getConnectionOptions(dbConfig);
    const connection: Connection = await createConnection(connectionOptions);
    if (connection.isConnected) return true;
    else
      throw new Error(
        "Connection not established make sure your configuration is correct"
      );
  }
}
