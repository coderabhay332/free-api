import { IApp } from "../app/app.dto";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import AppSchema from "../app/app.schema";
import bcrypt from "bcrypt";
import { generateApiKey } from "../common/helper/apiKey-generator";
import ApiKeySchema from "../apikey/apikey.schema";
import ServiceSchema from "../service/service.schema";
import mongoose from "mongoose";
import { Types } from "mongoose";

export const createUser = async (data: IUser) => {
  const result = await UserSchema.create({ ...data, active: true });
  return result.toObject();
};

export const updateUser = async (id: string, data: IUser) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const me = async (user: any) => {
  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }
  const result = await UserSchema.findById(user.id).select('-password').lean();
  if (!result) {
    throw new Error('User not found');
  }
  return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne({ _id: id });
  return result;
};

export const getUserById = async (id: string) => {
  const result = await UserSchema.findById(id).lean();
  return result;
};

export const getAllUser = async () => {
  const result = await UserSchema.find({}).lean();
  return result;
};

export const login = async (email: string, password: string) => {
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
};

export const getUserByEmail = async (email: string, withPassword = false) => {
  if (withPassword) {
      const result = await UserSchema.findOne({ email }).select('+password').lean();
      return result;
  }
};

export const createApp = async (userId: string, data: IApp) => {
  console.log('Creating app with data:', { userId, data });
  const result = await AppSchema.create({ ...data, user: userId });
  console.log('App created:', result);
  const apiKey = generateApiKey();
  console.log('Generated API key:', apiKey);
  const apiKeyResult = await ApiKeySchema.create({ 
    key: apiKey, 
    app: result._id, 
    isActive: true 
  });
  console.log('API key created:', apiKeyResult);
  
  // Update app with API key reference
  result.apiKey = apiKeyResult._id as any;
  await result.save();
  
  // Return app with populated API key
  const appWithKey = await AppSchema.findById(result._id)
    .populate('apiKey')
    .populate('user')
    .lean();
    
  return appWithKey;
};

export const subscribeApi = async (userId: string, serviceId: string, appId: string) => {
  try {
    const user = await UserSchema.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    const app = await AppSchema.findById(appId);
    if (!app) {
      throw new Error("App not found");
    }

    // Convert serviceId to ObjectId for comparison
    const serviceObjectId = new Types.ObjectId(serviceId);
    
    if(app.subscribedApis?.some(id => id.toString() === serviceId)){
      throw new Error("Service already subscribed");
    }

    // Initialize arrays if they don't exist
    if (!app.subscribedApis) app.subscribedApis = [];
    if (!app.blockedApis) app.blockedApis = [];

    app.subscribedApis.push(serviceObjectId);
    const service = await ServiceSchema.findById(serviceId);
    if(!service){
      throw new Error("Service not found");
    }

    // Check if app already has an API key
    if (!app.apiKey) {
      const apiKey = generateApiKey();
      const apiKeyResult = await ApiKeySchema.create({ 
        key: apiKey, 
        app: app._id, 
        isActive: true 
      });
      app.apiKey = apiKeyResult._id;
    }

    await app.save();

    // Get the API key
    const apiKeyDoc = await ApiKeySchema.findById(app.apiKey);
    if (!apiKeyDoc) {
      throw new Error("API key not found");
    }

    // Return the updated app with populated API key and constructed endpoint
    const updatedApp = await AppSchema.findById(appId)
      .populate('apiKey')
      .populate('user')
      .lean();

    // Add the full endpoint with API key
    const fullEndpoint = `${service.endpoint}?key=${apiKeyDoc.key}`;

    return {
      ...updatedApp,
      subscribedEndpoint: fullEndpoint
    };
  } catch (error: any) {
    console.error('Subscribe API Error:', error);
    throw error;
  }
};

export const blockApi = async (userId: string, serviceId: string, appId: string) => {
  const app = await AppSchema.findById(appId);
  if (!app) {
    throw new Error("App not found");
  }

  // Initialize arrays if they don't exist
  if (!app.subscribedApis) app.subscribedApis = [];
  if (!app.blockedApis) app.blockedApis = [];

  app.blockedApis.push(serviceId as any);
  await app.save();

  // Return updated app with populated data
  const updatedApp = await AppSchema.findById(appId)
    .populate('apiKey')
    .populate('user')
    .lean();

  return updatedApp;
};

export const unblockApi = async (userId: string, serviceId: string, appId: string) => {
  const app = await AppSchema.findById(appId);
  if (!app) {
    throw new Error("App not found");
  }

  // Initialize arrays if they don't exist
  if (!app.subscribedApis) app.subscribedApis = [];
  if (!app.blockedApis) app.blockedApis = [];

  app.blockedApis = app.blockedApis.filter((api) => api.toString() !== serviceId);
  await app.save();

  // Return updated app with populated data
  const updatedApp = await AppSchema.findById(appId)
    .populate('apiKey')
    .populate('user')
    .lean();

  return updatedApp;
};