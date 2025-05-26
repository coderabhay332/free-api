import * as apikeyService from "./apikey.service";
import { createResponse } from "../common/helper/response.helper";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";

export const createApikey = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await apikeyService.createApikey(req.body);
    res.send(createResponse(result, "Apikey created sucssefully"));
  },
);

export const updateApikey = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await apikeyService.updateApikey(req.params.id, req.body);
    res.send(createResponse(result, "Apikey updated sucssefully"));
  },
);

export const editApikey = asyncHandler(async (req: Request, res: Response) => {
  const result = await apikeyService.editApikey(req.params.id, req.body);
  res.send(createResponse(result, "Apikey updated sucssefully"));
});

export const deleteApikey = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await apikeyService.deleteApikey(req.params.id);
    res.send(createResponse(result, "Apikey deleted sucssefully"));
  },
);

export const getApikeyById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await apikeyService.getApikeyById(req.params.id);
    res.send(createResponse(result));
  },
);

export const getAllApikey = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await apikeyService.getAllApikey();
    res.send(createResponse(result));
  },
);
