import { type Request, type Response, type NextFunction } from "express";
import ApiKeySchema from "../../apikey/apikey.schema";
import UserSchema from "../../user/user.schema";
import ServiceSchema from "../../service/service.schema";
import AppSchema from "../../app/app.schema";

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.query.key as string || req.headers["x-api-key"] as string;

    console.log('API Key:', apiKey);
    console.log('Request Path:', req.path);
    
    if (!apiKey) {
      res.status(400).json({
        success: false,
        error_code: 400,
        message: "API key is required",
        data: null
      });
      return;
    }

    const apiKeyDoc = await ApiKeySchema.findOne({ key: apiKey });
    console.log('API Key Doc:', apiKeyDoc);

    if (!apiKeyDoc) {
      res.status(401).json({
        success: false,
        error_code: 401,
        message: "Invalid API key",
        data: null
      });
      return;
    }

    if (!apiKeyDoc.isActive) {
      res.status(401).json({
        success: false,
        error_code: 401,
        message: "API key is inactive",
        data: null
      });
      return;
    }

    
    const app = await AppSchema.findById(apiKeyDoc.app);
    console.log('App:', app);

    if (!app) {
      res.status(404).json({
        success: false,
        error_code: 404,
        message: "App not found",
        data: null
      });
      return;
    }

    
    const fullPath = `http://localhost:5000/api/services${req.path}`;
    console.log('Looking for service with endpoint:', fullPath);
    const service = await ServiceSchema.findOne({ endpoint: fullPath });
    console.log('Service:', service);

    if (!service) {
      res.status(404).json({
        success: false,
        error_code: 404,
        message: `Service not found for endpoint: ${fullPath}`,
        data: null
      });
      return;
    }

    
    if (app.blockedApis?.includes(service._id as any)) {
      res.status(401).json({
        success: false,
        error_code: 401,
        message: "This API is blocked for your app",
        data: null
      });
      return;
    }

   
    if (!app.subscribedApis?.includes(service._id as any)) {
      res.status(403).json({
        success: false,
        error_code: 403,
        message: "This API is not subscribed",
        data: {
          endpoint: fullPath,
          apiKey: apiKey,
          subscriptionRequired: true
        }
      });
      return;
    }

    
    const user = await UserSchema.findById(app.user);
    console.log('User:', user);

    if (!user) {
      res.status(404).json({
        success: false,
        error_code: 404,
        message: "User not found",
        data: null
      });
      return;
    }

    const totalCredits = user.wallet.balance + user.wallet.freeCredits;
    console.log('Total Credits:', totalCredits, 'Service Price:', service.pricePerCall);

    if (totalCredits < service.pricePerCall) {
      res.status(402).json({
        success: false,
        error_code: 402,
        message: "Insufficient credits",
        data: {
          endpoint: fullPath,
          apiKey: apiKey,
          requiredCredits: service.pricePerCall,
          availableCredits: totalCredits
        }
      });
      return;
    }

    
    req.user = user;
    req.service = service;
    req.apiKey = apiKeyDoc;
    
    next();
  } catch (error: any) {
    console.error('API Key Middleware Error:', error);
    console.error('Error Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error_code: 500,
      message: "Internal server error",
      data: null
    });
  }
}; 