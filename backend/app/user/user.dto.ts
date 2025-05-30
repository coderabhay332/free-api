import { ObjectId } from "mongoose";
import { BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {

  name: string;
  email: string;
  password: string;
  role: string;
  refreshToken?: string;
  wallet: {
    balance: number;
    freeCredits: number;
  };
  apps?: ObjectId[];
  
}
