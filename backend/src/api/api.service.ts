import apiSchema from "./api.schema"
import userSchema from "../user/user.schema";
import axios from "axios";
import { Types } from "mongoose";
import { generateApiKey } from "../common/helper/apiKey-generator";
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

  const isSubscribed = user.subscribedApis.some(sub => sub.api.equals(api._id));
  if (!isSubscribed) throw new Error("User not subscribed to this API");

  if (user.credit < api.pricePerRequest) {
    throw new Error("Insufficient credit");
  }

  api.authHeader = authHeader;

  
  user.credit -= api.pricePerRequest;
  api.callCount += 1;
  await Promise.all([user.save(), api.save()]);

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

    // Check if already subscribed
    const isSubscribed = user.subscribedApis.some(sub => sub.api.toString() === apiId);
    if (isSubscribed) {
        throw new Error("User already subscribed to this API");
    }

    // Check credit
    if (user.credit < apiDoc.pricePerRequest) {
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
    if (!apiDoc.subscribedUsers.includes(new Types.ObjectId(userId))) {
        apiDoc.subscribedUsers.push(new Types.ObjectId(userId));
    }
    
    try {
        await Promise.all([user.save(), apiDoc.save()]);
        return { url: `${apiDoc.endpoint}?apiKey=${user.apiKey}` };
    } catch (error) {
        console.error('Subscription error:', error);
        throw new Error("Failed to subscribe to API");
    }
};

// Demo services
const getApiByName = async (name: string) => {
    const api = await apiSchema.findOne({ name });
    if (!api) {
        throw new Error(`API with name "${name}" not found`);
    }
    return api._id;
};

export const checkUserAccess = async (apiKey: string, apiId: string) => {
    const user = await userSchema.findOne({ apiKey });
    if (!user) throw new Error("Invalid API key");

    const api = await apiSchema.findById(apiId);
    if (!api) throw new Error("API not found");

    const subscription = user.subscribedApis.find(sub => sub.api.equals(api._id));
    if (!subscription) {
        throw new Error("User not subscribed to this API");
    }

    if (user.credit < api.pricePerRequest) {
        throw new Error("Insufficient credit");
    }

    // Deduct credit and increment call count
    user.credit -= api.pricePerRequest;
    api.callCount += 1;
    subscription.hit += 1;
    await Promise.all([user.save(), api.save()]);

    return { user, api };
};

export const getDemoUsers = async (apiKey: string) => {
    const apiId = await getApiByName("Users");
    await checkUserAccess(apiKey, apiId);
    
    return [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" }
    ];
};

export const getDemoProducts = async (apiKey: string) => {
    const apiId = await getApiByName("Products");
    await checkUserAccess(apiKey, apiId);
    
    return [
        { id: 1, name: "Laptop", price: 999.99, category: "Electronics" },
        { id: 2, name: "Smartphone", price: 699.99, category: "Electronics" },
        { id: 3, name: "Headphones", price: 199.99, category: "Accessories" }
    ];
};

export const getDemoWeather = async (apiKey: string) => {
    const apiId = await getApiByName("Weather");
    await checkUserAccess(apiKey, apiId);
    
    return [
        { city: "New York", temperature: 22, condition: "Sunny" },
        { city: "London", temperature: 18, condition: "Cloudy" },
        { city: "Tokyo", temperature: 25, condition: "Rainy" }
    ];
};

export const getDemoNews = async (apiKey: string) => {
    const apiId = await getApiByName("News");
    await checkUserAccess(apiKey, apiId);
    
    return [
        { id: 1, title: "Tech Innovation", category: "Technology", date: "2024-03-20" },
        { id: 2, title: "Sports Update", category: "Sports", date: "2024-03-20" },
        { id: 3, title: "Business News", category: "Business", date: "2024-03-20" }
    ];
};