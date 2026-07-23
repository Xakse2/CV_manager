import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { getGeneratedCV, createCV, getMyCVs } from "../services/cv.service.js";
import { updateAttribute } from "../services/userAttribute.service.js";

export const getCV = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const cv = await getGeneratedCV(req.params.id);

    return res.json(cv);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        error: "CV not found",
      });
    }

    return res.status(404).json({
      error: error instanceof Error ? error.message : "CV not found",
    });
  }
};

export const updateCVAttribute = async (req: Request, res: Response) => {
  try {
    const { attributeId, value } = req.body;

    const updated = await updateAttribute(req.user.userId, attributeId, value);

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Update failed",
    });
  }
};

export const generateCV = async (req: Request, res: Response) => {
  try {
    const { positionId } = req.body;

    const newCV = await createCV(req.user.userId, positionId);

    return res.status(201).json(newCV);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to create CV",
    });
  }
};

export const getMyCV = async (req: Request, res: Response) => {
  try {
    const cvs = await getMyCVs(req.user.userId);

    return res.json(cvs);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to get CVs",
    });
  }
};
