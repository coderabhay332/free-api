import { ObjectId } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IApikey extends BaseSchema {
  key: string;
  app: ObjectId;
  isActive?: boolean;
  createdAt: string;
}
