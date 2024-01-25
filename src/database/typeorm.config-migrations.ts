import { ConnectionOptions } from "typeorm";
import { getTypeormConfig } from "../connection.options";
import dotenv from "dotenv";

dotenv.config();

const initializeTypeORMConfig = async (): Promise<ConnectionOptions> => getTypeormConfig();
const typrOrmConfig = initializeTypeORMConfig();

(async () => {
  console.log(await typrOrmConfig);
})();

export default typrOrmConfig;

// tinyint => boolean
// longblob => bytea
// blob => bytea
