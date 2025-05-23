import { type BaseSchema } from "../common/dto/base.dto";
import mongoose, { Types } from "mongoose";
export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password: string;
  role: string;
  subscribedApis: {
    api: Types.ObjectId;
    apiKey: string;
  }[];
  credit: number;
  refreshToken?: string;

}

