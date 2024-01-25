import { CommonDTOs } from "./common/dto";
import { Request as ExpressRequest } from "express";

declare global {
  export interface RequestTypes extends RequestInterface {
    // req: import("/Users/zohaib.shahid/Documents/gold/src/user/entity/user.entity").User;
    // req: import("/Users/zohaib.shahid/Documents/gold/src/user/entity/user.entity").User;
    // req: import("/Users/zohaib.shahid/Documents/gold/src/user/entity/user.entity").User;
  }
}

export interface RequestInterface extends ExpressRequest {
  currentUser: CommonDTOs.CurrentUser;
}
