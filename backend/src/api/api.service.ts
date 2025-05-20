import apiSchema from "./api.schema"
import userSchema from "../user/user.schema";
import axios from "axios";
import { Types } from "mongoose";

export const createApi = async (name: string, description: string, endpoint: string, method: string, pricePerRequest: number) => {
    const api = await apiSchema.create({
        name,
        description,
        endpoint,
        method,
        pricePerRequest,
    });
    
    return api;
}

export const getAllApis = async () => {
    const apis = await apiSchema.find({}).populate("createdBy", "name email").populate("updatedBy", "name email");
    return apis;
}
export const getApiById = async (id: string) => {
    const api = await apiSchema.findById(id).populate("createdBy", "name email").populate("updatedBy", "name email");
    if (!api) {
        throw new Error("API not found");
    }
    return api;
}

export const checkSubscription = async (userId: string, apiId: string) => {
    const api = await apiSchema.findById(apiId).populate("createdBy", "name email").populate("updatedBy", "name email");
    if (!api) {
        throw new Error("API not found");
    }
    console.log("subscribedUsers", api.subscribedUsers);
    console.log("userId", userId);
    const isSubscribed = api.subscribedUsers.some((user) => user._id.toString() === userId);
    console.log("isSubscribed", isSubscribed);
    if (!isSubscribed) {
        throw new Error("User not subscribed to this API");
    }
    
}

export const responseApi = async (userId: string, apiId: string, authHeader: string) => {
  const user = await userSchema.findById(userId);
  if (!user) throw new Error("User not found");

  const api = await apiSchema.findById(apiId);
  if (!api) throw new Error("API not found");

  const isSubscribed = user.subscribedApis.some((id) => id.equals(api._id));
  if (!isSubscribed) throw new Error("User not subscribed to this API");

  if (user.credit < api.pricePerRequest) {
    throw new Error("Insufficient credit");
  }

  api.authHeader = authHeader;

  // Deduct credit and update API usage
  user.credit -= api.pricePerRequest;
  api.callCount += 1;
  await Promise.all([user.save(), api.save()]);

  // Prepare Axios request
  const method = api.method.toLowerCase();
  

  try {
    const response = await axios({
      method,
      url: api.endpoint,
      headers: api.authHeader ? { Authorization: api.authHeader } : {},
      data: method === "get" ? undefined : {}, // You can customize the body if needed
    });

    return {
      message: "API request successful",
      response: response.data,
    };

  } catch (err: any) {
    console.error("Error in API call:", err.message);
    throw new Error(`Request failed with status ${err.response?.status || 500}`);
  }
};

export const demoApi = async (userId: string, apiId: string) => {
    const api = await apiSchema.findById(apiId).populate("createdBy", "name email").populate("updatedBy", "name email");
   const user = await userSchema.findById(userId);
   if(!user) {
       throw new Error("User not found");
   }
   if (!api) {
       throw new Error("API not found");
   }
    const isSubscribed = api.subscribedUsers.some((user) => user._id.toString() === userId);
   if (!isSubscribed) {
       throw new Error("User not subscribed to this API");
   }
    if (user.credit < api.pricePerRequest) {
         throw new Error("Insufficient credit");
    }

    user.credit -= api.pricePerRequest;
    api.callCount += 1;
    await Promise.all([user.save(), api.save()]);

}

export const analyzeApi = async (userId: string, apiId: string) => {

    const api = await apiSchema.findById(apiId).populate("createdBy", "name email").populate("updatedBy", "name email").populate("subscribedUsers", "name email");
    return api;
}

export const subscribeApi = async (userId: string, apiId: string) => {
    const apiDoc = await apiSchema.findById(apiId);
    if (!apiDoc) throw new Error("API not found");
    const user = await userSchema.findById(userId);
    if (!user) throw new Error("User not found");

    if(user.subscribedApis.includes(new Types.ObjectId(apiId))) {
        throw new Error("User already subscribed to this API");
    }
    if (user.credit < apiDoc.pricePerRequest) {
        throw new Error("Insufficient credit");
    }

    // Update both user and API documents
    user.subscribedApis.push(new Types.ObjectId(apiId));
    apiDoc.subscribedUsers.push(new Types.ObjectId(userId));
    
    await Promise.all([user.save(), apiDoc.save()]);
    return apiDoc;
}