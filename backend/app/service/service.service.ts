import { type IService } from "./service.dto";
import ServiceSchema from "./service.schema";
import UserSchema from "../user/user.schema";

export const createService = async (data: IService) => {
  const result = await ServiceSchema.create({ ...data, active: true });
  return result;
};

export const updateService = async (id: string, data: IService) => {
  const result = await ServiceSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

export const editService = async (id: string, data: Partial<IService>) => {
  const result = await ServiceSchema.findOneAndUpdate({ _id: id }, data);
  return result;
};

export const deleteService = async (id: string) => {
  const result = await ServiceSchema.deleteOne({ _id: id });
  return result;
};

export const getServiceById = async (id: string) => {
  const result = await ServiceSchema.findById(id).lean();
  return result;
};

export const getAllService = async () => {
  const result = await ServiceSchema.find({}).lean();
  return result;
};

export const getWeather = async (userId: string, serviceId: string) => {
  // Deduct credits from user's wallet
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  // Deduct from free credits first, then from balance
  if (user.wallet.freeCredits >= service.pricePerCall) {
    user.wallet.freeCredits -= service.pricePerCall;
  } else {
    const remainingCost = service.pricePerCall - user.wallet.freeCredits;
    user.wallet.freeCredits = 0;
    user.wallet.balance -= remainingCost;
  }

  await user.save();

  // Return dummy weather data
  return {
    location: "New York",
    temperature: 72,
    condition: "Sunny",
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: "Monday", high: 75, low: 65, condition: "Sunny" },
      { day: "Tuesday", high: 78, low: 68, condition: "Partly Cloudy" },
      { day: "Wednesday", high: 80, low: 70, condition: "Clear" }
    ]
  };
};

export const getRandomUser = async (userId: string, serviceId: string) => {
  // Deduct credits from user's wallet
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  // Deduct from free credits first, then from balance
  if (user.wallet.freeCredits >= service.pricePerCall) {
    user.wallet.freeCredits -= service.pricePerCall;
  } else {
    const remainingCost = service.pricePerCall - user.wallet.freeCredits;
    user.wallet.freeCredits = 0;
    user.wallet.balance -= remainingCost;
  }

  await user.save();

  // Return mock user data
  return {
    name: {
      first: "John",
      last: "Doe",
      title: "Mr"
    },
    email: "john.doe@example.com",
    location: {
      city: "New York",
      country: "USA",
      state: "NY"
    },
    picture: {
      large: "https://randomuser.me/api/portraits/men/1.jpg",
      medium: "https://randomuser.me/api/portraits/med/men/1.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/men/1.jpg"
    }
  };
};

export const getJoke = async (userId: string, serviceId: string) => {
  // Deduct credits from user's wallet
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  // Deduct from free credits first, then from balance
  if (user.wallet.freeCredits >= service.pricePerCall) {
    user.wallet.freeCredits -= service.pricePerCall;
  } else {
    const remainingCost = service.pricePerCall - user.wallet.freeCredits;
    user.wallet.freeCredits = 0;
    user.wallet.balance -= remainingCost;
  }

  await user.save();

  // Return mock joke data
  return {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!",
    type: "general"
  };
};

export const getQuote = async (userId: string, serviceId: string) => {
  // Deduct credits from user's wallet
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  // Deduct from free credits first, then from balance
  if (user.wallet.freeCredits >= service.pricePerCall) {
    user.wallet.freeCredits -= service.pricePerCall;
  } else {
    const remainingCost = service.pricePerCall - user.wallet.freeCredits;
    user.wallet.freeCredits = 0;
    user.wallet.balance -= remainingCost;
  }

  await user.save();

  // Return mock quote data
  return {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tags: ["inspiration", "work"]
  };
};

export const getNews = async (userId: string, serviceId: string) => {
  // Deduct credits from user's wallet
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  // Deduct from free credits first, then from balance
  if (user.wallet.freeCredits >= service.pricePerCall) {
    user.wallet.freeCredits -= service.pricePerCall;
  } else {
    const remainingCost = service.pricePerCall - user.wallet.freeCredits;
    user.wallet.freeCredits = 0;
    user.wallet.balance -= remainingCost;
  }

  await user.save();

  // Return mock news data
  return [
    {
      title: "Tech Company Announces Revolutionary AI Breakthrough",
      description: "A leading tech company has announced a major breakthrough in artificial intelligence technology.",
      source: "Tech Daily",
      publishedAt: "2024-03-20T10:00:00Z"
    },
    {
      title: "Global Climate Summit Reaches New Agreement",
      description: "World leaders have reached a new agreement on climate change initiatives.",
      source: "Global News",
      publishedAt: "2024-03-20T09:30:00Z"
    },
    {
      title: "New Study Reveals Benefits of Remote Work",
      description: "A comprehensive study shows increased productivity and job satisfaction among remote workers.",
      source: "Business Insider",
      publishedAt: "2024-03-20T09:00:00Z"
    }
  ];
};