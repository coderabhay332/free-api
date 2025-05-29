import { type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import createError from "http-errors";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("Auth header:", req.headers.authorization);
  
  passport.authenticate("jwt", { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error("Auth error:", err);
      return next(err);
    }

    if (!user) {
      console.error("No user found in auth:", info);
      return next(createError(401, "Authentication required"));
    }

    // Set the user in the request
    req.user = user;
    console.log("User authenticated successfully:", user._id);
    
    next();
  })(req, res, next);
}; 