import * as serviceService from "./service.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import { IUser } from "../user/user.dto";
import createError from "http-errors";

export const createService = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await serviceService.createService(req.body);
    res.send(createResponse(result, "Service created sucssefully"));
  },
);

export const updateService = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await serviceService.updateService(req.params.id, req.body);
    res.send(createResponse(result, "Service updated sucssefully"));
  },
);

export const editService = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.editService(req.params.id, req.body);
  res.send(createResponse(result, "Service updated sucssefully"));
});

export const deleteService = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await serviceService.deleteService(req.params.id);
    res.send(createResponse(result, "Service deleted sucssefully"));
  },
);

export const getServiceById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await serviceService.getServiceById(req.params.id);
    res.send(createResponse(result));
  },
);

export const getAllService = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await serviceService.getAllService();
    res.send(createResponse(result));
  },
);

export const getWeather = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.getWeather(
    (req.user as IUser)?.id,
    (req.service as any)._id
  );
  res.send(createResponse(result));
});

export const getRandomUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.getRandomUser(
    (req.user as IUser)?.id,
    (req.service as any)._id
  );
  res.send(createResponse(result));
});

export const getJoke = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.getJoke(
    (req.user as IUser)?.id,
    (req.service as any)._id
  );
  res.send(createResponse(result));
});

export const getQuote = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.getQuote(
    (req.user as IUser)?.id,
    (req.service as any)._id
  );
  res.send(createResponse(result));
});

export const getNews = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.getNews(
    (req.user as IUser)?.id,
    (req.service as any)._id
  );
  res.send(createResponse(result));
});

export const getUserServiceAnalytics = asyncHandler(async (req: Request, res: Response) => {
  
  console.log("req.user", req.user);
  if (!req.user) {
    throw createError(401, "User not authenticated");
  }

  const userId = req.user.id;
  if (!userId) {
    throw createError(401, "User ID not found");
  }

  console.log("userId", userId);
  const result = await serviceService.getUserAnalytics(userId.toString());
  res.send(createResponse(result));
});

export const getAdminServiceAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const result = await serviceService.getAdminAnalytics();
  res.send(createResponse(result));
});