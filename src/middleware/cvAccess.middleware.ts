import type { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { UserRole } from "@prisma/client";

export const cvAccessMiddleware = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const cvId = req.params.id;

    const cv = await prisma.cV.findUnique({
      where: {
        id: cvId,
      },
      select: {
        userId: true,
        isPublished: true,
      },
    });

    if (!cv) {
      return res.status(404).json({
        message: "CV not found",
      });
    }

    const user = req.user;

    if (user.role === UserRole.ADMIN) {
      return next();
    }

    if (user.role === UserRole.CANDIDATE) {
      if (cv.userId !== user.userId) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      return next();
    }

    if (user.role === UserRole.RECRUITER) {
      if (!cv.isPublished) {
        return res.status(403).json({
          message: "CV is not published",
        });
      }

      return next();
    }

    return res.status(403).json({
      message: "Forbidden",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Access check failed",
    });
  }
};
