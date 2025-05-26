import { type BaseSchema } from "../common/dto/base.dto";
import { ObjectId } from "mongoose";

export interface IApp extends BaseSchema {
  name: string;
  user: ObjectId;
  createdAt: string;
  apiKey: ObjectId;
  subscribedApis: string[]; 
  blockedApis: string[];
}
