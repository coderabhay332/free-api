import { IApp } from "../app/app.dto";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import AppSchema from "../app/app.schema";
import bcrypt from "bcrypt";
import { generateApiKey } from "../common/helper/apiKey-generator";
import ApiKeySchema from "../apikey/apikey.schema";
import ServiceSchema from "../service/service.schema";
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
  return result;
};

export const subscribeApi = async (userId: string, serviceId: string, appId: string) => {
  const user = await UserSchema.findById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  const app = await AppSchema.findById(appId);
  if (!app) {
    throw new Error("App not found");
  }

  if(app.subscribedApis.includes(serviceId)){
    throw new Error("Service already subscribed");
  }
  app.subscribedApis.push(serviceId);
  const service = await ServiceSchema.findById(serviceId);
  if(!service){
    throw new Error("Service not found");
  }

  const apiKey = await ApiKeySchema.findOne({ app: appId });
  if(!apiKey){
    throw new Error("Api key not found");
  }
  await app.save();
  return service.endpoint+`?key=${apiKey.key}`;
};

export const blockApi = async (userId: string, serviceId: string, appId: string) => {
  const app = await AppSchema.findById(appId);
  if (!app) {
    throw new Error("App not found");
  }
  app.blockedApis.push(serviceId);
  await app.save();
  return app;
};

export const unblockApi = async (userId: string, serviceId: string, appId: string) => {
  const app = await AppSchema.findById(appId);
  if (!app) {
    throw new Error("App not found");
  }
  app.blockedApis = app.blockedApis.filter((api) => api.toString() !== serviceId);
  await app.save();
  return app;
};