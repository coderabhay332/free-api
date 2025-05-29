import { ObjectId } from "mongoose";

export interface IUser {
  id: string;
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
