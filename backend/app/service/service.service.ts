import { type IService } from "./service.dto";
import ServiceSchema, { ServiceStatsSchema } from "./service.schema";
import UserSchema from "../user/user.schema";
import AppSchema from "../app/app.schema";

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
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  
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
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  if (user.wallet.freeCredits >= service.pricePerCall) {
    user.wallet.freeCredits -= service.pricePerCall;
  } else {
    const remainingCost = service.pricePerCall - user.wallet.freeCredits;
    user.wallet.freeCredits = 0;
    user.wallet.balance -= remainingCost;
  }

  await user.save();

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
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

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
  const user = await UserSchema.findById(userId);
  const service = await ServiceSchema.findById(serviceId);

  if (!user || !service) {
    throw new Error("User or service not found");
  }

  if (user.wallet.freeCredits >= service.pricePerCall) {
    user.wallet.freeCredits -= service.pricePerCall;
  } else {
    const remainingCost = service.pricePerCall - user.wallet.freeCredits;
    user.wallet.freeCredits = 0;
    user.wallet.balance -= remainingCost;
  }

  await user.save();

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

export const getUserAnalytics = async (userId: string) => {
  const user = await UserSchema.findById(userId);
  const apps = await AppSchema.find({ user: userId });
  
  const subscribedServices = await ServiceSchema.find({
    _id: { $in: apps.flatMap(app => app.subscribedApis || []) }
  });

  const serviceStats = await Promise.all(subscribedServices.map(async (service) => {
    const userHitStat = await ServiceStatsSchema.findOne({ user: userId, service: service._id });
    const hitCount = userHitStat?.hitCount || 0;
    return {
      serviceId: service._id,
      serviceName: service.name,
      hits: hitCount,
      spent: hitCount * service.pricePerCall,
      pricePerCall: service.pricePerCall,
      lastHit: userHitStat?.lastHit || null,
      recentHits: userHitStat?.hitHistory?.slice(-5).map(hit => ({
        timestamp: hit.timestamp,
        responseTime: hit.responseTime,
        status: hit.status
      })) || []
    };
  }));

  const totalHits = serviceStats.reduce((sum, stat) => sum + stat.hits, 0);
  const totalSpent = serviceStats.reduce((sum, stat) => sum + stat.spent, 0);

  return {
    summary: {
      totalHits,
      totalSpent,
      subscribedServicesCount: subscribedServices.length,
      successCount: totalHits,
      failureCount: 0
    },
    serviceDetails: serviceStats
  };
};

export const getAdminAnalytics = async () => {
  const users = await UserSchema.find();
  const apps = await AppSchema.find();
  const services = await ServiceSchema.find();

  // Get detailed service statistics
  const serviceStats = await Promise.all(services.map(async (service) => {
    const serviceHits = await ServiceStatsSchema.find({ service: service._id });
    const totalHits = serviceHits.reduce((acc, stat) => acc + stat.hitCount, 0);
    const totalRevenue = totalHits * service.pricePerCall;
    const uniqueUsers = new Set(serviceHits.map(stat => stat.user.toString())).size;
    
    // Get recent activity
    const recentHits = serviceHits
      .flatMap(stat => stat.hitHistory || [])
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);

    return {
      serviceId: service._id,
      name: service.name,
      description: service.description,
      pricePerCall: service.pricePerCall,
      stats: {
        totalHits,
        totalRevenue,
        uniqueUsers,
        averageResponseTime: recentHits.reduce((acc, hit) => acc + (hit.responseTime || 0), 0) / recentHits.length || 0
      },
      recentActivity: recentHits.map(hit => ({
        timestamp: hit.timestamp,
        responseTime: hit.responseTime,
        status: hit.status
      }))
    };
  }));

  // Calculate overall statistics
  const totalRevenue = serviceStats.reduce((sum, service) => sum + service.stats.totalRevenue, 0);
  const totalHits = serviceStats.reduce((sum, service) => sum + service.stats.totalHits, 0);
  const totalUniqueUsers = new Set(serviceStats.flatMap(service => 
    service.stats.uniqueUsers
  )).size;

  // Get top performing services
  const topServices = [...serviceStats]
    .sort((a, b) => b.stats.totalHits - a.stats.totalHits)
    .slice(0, 5);

  return {
    summary: {
      totalUsers: users.length,
      totalApps: apps.length,
      totalServices: services.length,
      totalRevenue,
      totalHits,
      totalUniqueUsers,
      averageHitsPerService: totalHits / services.length || 0,
      averageRevenuePerService: totalRevenue / services.length || 0
    },
    topServices: topServices.map(service => ({
      name: service.name,
      hits: service.stats.totalHits,
      revenue: service.stats.totalRevenue,
      uniqueUsers: service.stats.uniqueUsers
    })),
    serviceDetails: serviceStats
  };
};