import { type IApikey } from "./apikey.dto";
import ApikeySchema from "./apikey.schema";

export const createApikey = async (data: IApikey) => {
  const result = await ApikeySchema.create({ ...data, isActive: true });
  return result;
};

export const updateApikey = async (id: string, data: IApikey) => {
  const result = await ApikeySchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editApikey = async (id: string, data: Partial<IApikey>) => {
  const result = await ApikeySchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteApikey = async (id: string) => {
  const result = await ApikeySchema.deleteOne({ _id: id });
  return result;
};

export const getApikeyById = async (id: string) => {
  const result = await ApikeySchema.findById(id).lean();
  return result;
};

export const getAllApikey = async () => {
  const result = await ApikeySchema.find({}).lean();
  return result;
};
