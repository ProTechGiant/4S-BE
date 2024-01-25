import Redis, { RedisKey } from "ioredis";

class RedisConnect {
  private readonly client: Redis;
  constructor() {
    this.client = new Redis();

    this.client.on("connect", () => {});

    this.client.on("error", (err) => {
      console.error(`Error connecting to Redis: ${err}`);
    });
  }

  async set(key: RedisKey, value: any, expiration = 6000) {
    // Set the key-value pair with an expiration time in seconds (default is 60 seconds)
    return this.client.set(key, JSON.stringify(value), "EX", expiration);
  }

  async get(key: RedisKey) {
    const result = await this.client.get(key);
    return result ? JSON.parse(result) : null;
  }
  async update(key: RedisKey, newValue: any, expiration = 6000) {
    const keyExists = await this.client.exists(key);

    if (keyExists) {
      return this.client.set(key, JSON.stringify(newValue), "EX", expiration);
    } else {
      throw new Error(`Key "${key}" does not exist in Redis.`);
    }
  }

  quit() {
    return this.client.quit();
  }
}

export const redisConnection = new RedisConnect();
