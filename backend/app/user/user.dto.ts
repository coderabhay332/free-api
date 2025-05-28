import { ObjectId } from "mongoose";

export interface IUser {
  _id: string;
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
  createdAt?: string;
  updatedAt?: string;
  
}
