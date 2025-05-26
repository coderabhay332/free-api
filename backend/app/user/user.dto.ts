import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  email: string;
  password: string;
  role: string;
  wallet: {
    balance: number;
    freeCredits: number
  }
  createdAt: string;
  apps: string[];
}
