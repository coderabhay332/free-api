import { type BaseSchema } from "../common/dto/base.dto";
import mongoose, { Types } from "mongoose";

export interface IApi extends BaseSchema {
  save(): any;
  authHeader: any;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  callCount: number;
  pricePerRequest: number;
  isActive: boolean;
  subscribedUsers: Types.ObjectId[];
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  module: string;
}

