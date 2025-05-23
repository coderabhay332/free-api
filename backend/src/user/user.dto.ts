import { type BaseSchema } from "../common/dto/base.dto";
import mongoose, { Types } from "mongoose";

export interface IUser extends BaseSchema {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  credit: number;
  apiKey?: string;
  refreshToken?: string;
  subscribedApis: Array<{
    api: Types.ObjectId;
    hit: number;
  }>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

