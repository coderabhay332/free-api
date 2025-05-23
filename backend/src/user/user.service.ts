import mongoose from "mongoose";
import apiSchema from "../api/api.schema";
import { type IUser } from "./user.dto";
import userSchema from "./user.schema";
require('dotenv').config();
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { Types } from "mongoose";
import { generateApiKey } from "../common/helper/apiKey-generator";


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
    const user = await userSchema.findById(userId);
    if (!user) throw new Error("User not found");

    const api = await apiSchema.findById(apiId);
    if (!api) throw new Error("API not found");

    // Check if already subscribed
    const isSubscribed = user.subscribedApis.some(sub => sub.api.toString() === apiId);
    if (isSubscribed) {
        throw new Error("User already subscribed to this API");
    }

    // Check credit
    if (user.credit < api.pricePerRequest) {
        throw new Error("Insufficient credit");
    }

    // Generate API key if user doesn't have one
    if (!user.apiKey) {
        user.apiKey = generateApiKey();
    }

    // Add subscription
    user.subscribedApis.push({
        api: new Types.ObjectId(apiId),
        hit: 0
    });

    // Add user to API's subscribed users
    if (!api.subscribedUsers.includes(new Types.ObjectId(userId))) {
        api.subscribedUsers.push(new Types.ObjectId(userId));
    }

    await Promise.all([user.save(), api.save()]);
    return { url: `${api.endpoint}?apiKey=${user.apiKey}` };
};

  export const getMe = async (userId: string) => {
    const user = await userSchema.findById(userId).select('-password').lean();
    return user;
  };

export const login = async (email: string, password: string) => {
  const user = await userSchema.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
};