import { ConnectionOptions } from "typeorm";
import dotenv from "dotenv";
import { DatabaseService } from "./database/database.service";

dotenv.config();

export const connectionToDatabase = async (isSuccess: () => void): Promise<void> => {
  await DatabaseService.forRoot({
    synchronize: false,
    logging: true,
    entities: ["src/**/entity/*.entity.ts"],
    migrations: ["src/**/migration/*.ts"],
    seeds: ["src/**/migration/*.ts"],
    seedsDir: "src/database/seeders",
    migrationsDir: "src/database/migrations",
  }).then((res) => {
    if (res) isSuccess();
  });
};

export const getTypeormConfig = async (): Promise<ConnectionOptions> => {
  const dbC = await DatabaseService.getTypeOrmConfig({
    synchronize: false,
    logging: true,
    entities: ["src/**/entity/*.ts"],
    migrations: ["src/**/" + process.env.MR + "/*.ts"],
    migrationsDir: "src/database/migrations",
  });
  return dbC;
};
