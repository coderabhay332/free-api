export interface Api {
  _id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  pricePerRequest: number;
  callCount: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  credit: number;
  subscribedApis: Array<{
    api: string;
    apiKey: string;
    hit: number;
    pricePerRequest: number;
  }>;
  apis?: Api[];
} 