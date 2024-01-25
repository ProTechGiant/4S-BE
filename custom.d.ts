// custom.d.ts

import { Redis } from "ioredis";
import { Request } from "express";

type RedisConnect = {
  customProperty: string;
};

// Extend the Request interface to include redisClient
declare module "express-serve-static-core" {
  interface Request {
    redisClient: (Redis & RedisConnect) | any;
  }
}
