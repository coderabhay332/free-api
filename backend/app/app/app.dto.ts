import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";

export interface IApp {
  _id?: string;
  name: string;
  user: Types.ObjectId;
  apiKey?: Types.ObjectId;
  subscribedApis?: Types.ObjectId[];
  blockedApis?: Types.ObjectId[];
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
