import mongoose from "mongoose";
import apiSchema from "../api/api.schema";
import { type IUser } from "./user.dto";
import userSchema from "./user.schema";
require('dotenv').config();
import jwt from "jsonwebtoken";


export const createUser = async (data: IUser) => {
  
    const result = await userSchema.create({ ...data, active: true});
    return result.toObject();
};

export const getUserById = async (id: string) => {
    console.log("ID", id);
    const result = await userSchema.findById(id)
      .select('-password') 
      .lean();
    return result;
  };

export const getUserByEmail = async (email: string, withPassword = false) => {
    if (withPassword) {
        const result = await userSchema.findOne({ email }).select('+password').lean();
        return result;
    }
};

export const generateRefreshToken = (id: string, role: string): string => {
    return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
  };  



  export const subscribeApi = async (userId: string, apiId: string) => {
    const [user, api] = await Promise.all([
      userSchema.findById(userId),
      apiSchema.findById(apiId),
    ]);
  
    if (!user) throw new Error("User not found");
    if (!api) throw new Error("API not found");
  
    if (user.credit < api.pricePerRequest) {
      throw new Error("Insufficient credit to subscribe this API");
    }
  
    const apiObjectId = new mongoose.Types.ObjectId(apiId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
  
    if (!user.subscribedApis.some(id => id.equals(apiObjectId))) {
      user.subscribedApis.push(apiObjectId);
    }
  
    if (!api.subscribedUsers.some(id => id.equals(userObjectId))) {
      api.subscribedUsers.push(userObjectId);
    }
  
    await Promise.all([user.save(), api.save()]);
  };

  export const getMe = async (userId: string) => {
    const user = await userSchema.findById(userId).select('-password').lean();
    return user;
  };