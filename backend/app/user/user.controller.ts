import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import { createUserTokens } from "../common/services/passport-jwt.services";
import { IUser } from "./user.dto";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  res.send(createResponse(result, "User created sucssefully"));
});
export const me = asyncHandler(async (req: Request, res: Response) => {
  console.log("req.user", req.user);
  const result = await userService.me(req.user as IUser);
  res.send(createResponse(result, "User fetched sucssefully"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.editUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted sucssefully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  res.send(createResponse(result));
});

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUser();
  res.send(createResponse(result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const tokens = createUserTokens(req.user as IUser)
  console.log(req.user);
  const updateUserToken = await userService.updateUserToken(req.user as IUser, tokens.refreshToken)
  res.send(createResponse({...tokens, user: req.user}, "Login successful"))
});

export const createApp = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id;
  const result = await userService.createApp(userId, req.body);
  res.send(createResponse(result, "App created sucssefully"));
});

export const subscribeApi = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)?._id;
    const result = await userService.subscribeApi(userId, req.params.id, req.body.appId);
    res.send(createResponse(result, "Api subscribed successfully"));
  } catch (error: any) {
    res.status(400).send(createResponse(null, error.message));
  }
});

export const blockApi = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id;
  const result = await userService.blockApi(userId, req.params.id, req.body.appId);
  res.send(createResponse( "Api blocked sucssefully"));
});

export const unblockApi = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id;
  const result = await userService.unblockApi(userId, req.params.id, req.body.appId);
  res.send(createResponse( "Api unblocked sucssefully"));
});
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.refreshToken(req.body.refreshToken);
  res.send(createResponse(result, "Token refreshed sucssefully"));
});
export const getAppByUserId = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id;
  const result = await userService.getAppByUserId(userId);
  res.send(createResponse(result));
});
export const addFunds = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id;
  const result = await userService.addFunds(userId, req.body.amount);
  res.send(createResponse(result, "Funds added sucssefully"));
});