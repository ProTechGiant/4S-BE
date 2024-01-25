export interface DbConfig {
  entities: [string];
  synchronize?: boolean;
  logging?: boolean;
  seeds?: [string];
  migrations?: [string];
  migrationsDir?: string;
  seedsDir?: string;
}
