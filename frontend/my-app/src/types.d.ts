export interface ApiResponse<T> {
    _id: string;
    data: T;
    message: string;
    success: boolean;
  }

export interface Api {
    _id: string;
    data: data;
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
 export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    plan; string;
    subscribedApis: Types.ObjectId[];
    credits: number;
    createdAt: string;
    updatedAt: string;
  }
export interface ApiListResponse {
    data: Api[];
    message: string;
    success: boolean;
  }  
 
  