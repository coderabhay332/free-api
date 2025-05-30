import * as appService from "./app.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import { type IUser } from "../user/user.dto";

export const createApp = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id;
  const result = await appService.createApp(userId,req.body);
  res.send(createResponse(result, "App created sucssefully"));
});

export const updateApp = asyncHandler(async (req: Request, res: Response) => {
  const result = await appService.updateApp(req.params.id, req.body);
  res.send(createResponse(result, "App updated sucssefully"));
});

export const editApp = asyncHandler(async (req: Request, res: Response) => {
  const result = await appService.editApp(req.params.id, req.body);
  res.send(createResponse(result, "App updated sucssefully"));
});

export const deleteApp = asyncHandler(async (req: Request, res: Response) => {
  const result = await appService.deleteApp(req.params.id);
  res.send(createResponse(result, "App deleted sucssefully"));
});

export const getAppById = asyncHandler(async (req: Request, res: Response) => {
  const result = await appService.getAppById(req.params.id);
  res.send(createResponse(result));
});

export const getAllApp = asyncHandler(async (req: Request, res: Response) => {
  const result = await appService.getAllApp();
  res.send(createResponse(result));
});
