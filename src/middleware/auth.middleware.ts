import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../util/jwt.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const token = authHeader.substring(7);

    req.user = verifyAccessToken(token);

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};
