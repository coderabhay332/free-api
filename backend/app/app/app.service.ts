import { generateApiKey } from "../common/helper/apiKey-generator";
import { type IApp } from "./app.dto";
import AppSchema from "./app.schema";
import ApiKeySchema from "../apikey/apikey.schema";
import UserSchema from "../user/user.schema";
export const createApp = async (userId: string, data: IApp) => {
  const result = await AppSchema.create({ ...data, user: userId });
  const user = await UserSchema.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.apps.push(result._id);
  await user.save();
  const apiKey = generateApiKey();
  const apiKeyDoc = await ApiKeySchema.create({ key: apiKey, app: result._id, isActive: true });
  result.apiKey = apiKeyDoc.id;
  await result.save();
  return result;
};

export const updateApp = async (id: string, data: IApp) => {
  const result = await AppSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editApp = async (id: string, data: Partial<IApp>) => {
  const result = await AppSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteApp = async (id: string) => {
  const result = await AppSchema.deleteOne({ _id: id });
  return result;
};

export const getAppById = async (id: string) => {
  const result = await AppSchema.findById(id).lean();
  return result;
};

export const getAllApp = async () => {
  const result = await AppSchema.find({}).lean();
  return result;
};
