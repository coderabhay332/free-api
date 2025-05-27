export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  pricePerCall: number;
  isActive: boolean;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  apiKey: any;
  _id: string;
  name: string;
  description: string;
  user: string;
  subscribedApis: string[];
  blockedApis: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  wallet: {
    balance: number;
    freeCredits: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: Service[];
}

export interface AppListResponse {
  success: boolean;
  message: string;
  data: App[];
}

export interface Api {
  _id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  callCount: number;
  pricePerRequest: number;
  isActive: boolean;
  subscribedUsers: string[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  module: string;
}

export interface ApiListResponse {
  data: Api[];
  message: string;
  success: boolean;
}  