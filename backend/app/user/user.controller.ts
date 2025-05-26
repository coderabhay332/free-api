import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  res.send(createResponse(result, "User created sucssefully"));
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
  const { email, password } = req.body;
  const result = await userService.login(email, password);
  
  // Generate tokens
  const accessToken = jwt.sign(
    { id: result._id, email: result.email, role: result.role },
    process.env.JWT_SECRET || 'your-secret',
    { expiresIn: '1h' }
  );


  res.json({
    accessToken,
    user: {
      id: result._id,
      email: result.email,
      role: result.role
    }
  });
});

export const createApp = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const result = await userService.createApp(userId, req.body);
  res.send(createResponse(result, "App created sucssefully"));
});

export const subscribeApi = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const result = await userService.subscribeApi(userId, req.params.id, req.body.appId);
  res.send(createResponse(result, "Api subscribed sucssefully"));
});

export const blockApi = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const result = await userService.blockApi(userId, req.params.id, req.body.appId);
  res.send(createResponse(result, "Api blocked sucssefully"));
});

export const unblockApi = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const result = await userService.unblockApi(userId, req.params.id, req.body.appId);
  res.send(createResponse(result, "Api unblocked sucssefully"));
});