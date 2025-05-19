import { type Request, type Response } from 'express';
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.helper";
import * as apiService from "./api.service";
import { type IApi } from "./api.dto";

// Extend Express Request interface to include apiData
declare global {
  namespace Express {
    interface Request {
      apiData?: any;
    }
  }
}
export const createApi = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, pricePerRequest, endpoint, method } = req.body;
  console.log(name)
  const result = await apiService.createApi(name, description, endpoint, method, pricePerRequest);


  res.send(createResponse(result, "API created successfully"));
});

export const getAllApis = asyncHandler(async (req: Request, res: Response) => {
  const result = await apiService.getAllApis();
  res.send(createResponse(result, "APIs fetched successfully"));
});
export const getApiById = asyncHandler(async (req: Request, res: Response) => {
  const apiId = req.params.id;
  const result = await apiService.getApiById(apiId);
  res.send(createResponse(result, "API fetched successfully"));
});

export const checkSubscription = asyncHandler(async (req: Request, res: Response, next: Function) => {
  const apiId = req.params.id;
  const userId = (req.user as any)?.id;
  console.log("userId", userId)
  const result = await apiService.checkSubscription(userId, apiId);
  req.apiData = result; 
  console.log("result", result)
  next();
});

export const responseApi = asyncHandler(async (req: Request, res: Response) => {
  const apiId = req.params.id;
  const userId = (req.user as any)?.id;
  const header = req.headers.authorization;
  if (!header) {
    res.status(400).send(createResponse(null, "Authorization header is required"));
    return;
  }
  console.log("header", header)
  const result = await apiService.responseApi(userId, apiId, header);
  res.send(createResponse(result, "API fetched successfully"));
}
);

export const demoApi = asyncHandler(async (req: Request, res: Response) => {
  const apiId = req.params.id;
  const userId = (req.user as any)?.id;
 const result = await apiService.demoApi(userId, apiId);
  res.send(createResponse( "API fetched successfully"));
}
);

export const analyzeApi = asyncHandler(async (req: Request, res: Response) => {
  const apiId = req.params.id;
  const userId = (req.user as any)?.id;
 const result = await apiService.analyzeApi(userId, apiId);
  res.send(createResponse(result, "API fetched successfully"));
}
);

