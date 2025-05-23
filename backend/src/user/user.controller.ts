import { type Request, type Response } from 'express';
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.helper";
import { createUserTokens } from '../common/services/passport-jwt.services';
import { type IUser } from "./user.dto";    
import * as userService from "./user.service";
import { generateApiKey } from '../common/helper/apiKey-generator';
import jwt from 'jsonwebtoken';
import userSchema from './user.schema';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const {email, name} = req.body;
      const result = await userService.createUser(req.body);
  
      const { password, ...user } = result;
      res.send(createResponse(user, "User created successfully"))
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

    const refreshToken = jwt.sign(
      { id: result._id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      { expiresIn: '7d' }
    );

  
    result.refreshToken = refreshToken;
    await result.save();

    res.send(createResponse({ 
      accessToken, 
      refreshToken,
      user: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        credit: result.credit
      }
    }, "Login successful"));
  });  

export const subscribeApi = asyncHandler(async (req: Request, res: Response) => {
  const apiId = req.params.id;
  const userId = (req.user as any)?.id;

  if(!userId) {
    res.status(401).send(createResponse(null, "User not found"));
    return;
  }
  
  const result = await userService.subscribeApi(userId, apiId);
  
  res.send(createResponse(result, "API subscribed successfully"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const result = await userService.getMe(userId);
  res.send(createResponse(result, "User fetched successfully"));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).send(createResponse(null, "Refresh token is required"));
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret');
    const user = await userService.getUserById((decoded as any).id);
    
    if (!user) {
      res.status(401).send(createResponse(null, "Invalid refresh token"));
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret',
      { expiresIn: '1h' }
    );

    res.send(createResponse({ accessToken }, "Token refreshed successfully"));
  } catch (error) {
    res.status(401).send(createResponse(null, "Invalid refresh token"));
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  if (userId) {
    await userService.getUserById(userId);
    // Clear refresh token
    await userSchema.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }
  res.send(createResponse(null, "Logged out successfully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const result = await userService.getUserById(userId);
  res.send(createResponse(result, "User fetched successfully"));
});

