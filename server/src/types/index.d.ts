// import { IUser } from "../models/users";

declare namespace Express {
  export interface User {
    _json: any;
  }

  export interface Request {
    userId: string;
    loggedInUser: any;
  }
}
