import { Request, Response, NextFunction } from "express";
import appConfig from "../config/appConfig";

/**
 * @module
 * middleware that checks if db connection is present or not. If not, then returns a 503 to client for all requests
 */
export default (_req: Request, res: Response, next: NextFunction) => {
  if (!appConfig.dbConnectionSuccessful) {
    return res
      .status(503)
      .json({ success: false, message: "Service temporarily down" });
  }
  next();
};
