import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  getMyAttributes,
  addAttribute,
  updateAttribute,
  deleteAttribute,
} from "../services/userAttribute.service.js";

type AttributeParams = {
  attributeId: string;
};

export const getUserAttributes = async (req: Request, res: Response) => {
  try {
    const attributes = await getMyAttributes(req.user.userId);

    return res.json(attributes);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to load attributes",
    });
  }
};

export const createUserAttribute = async (req: Request, res: Response) => {
  try {
    const { attributeId, value } = req.body;

    const attribute = await addAttribute(req.user.userId, attributeId, value);

    return res.status(201).json(attribute);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({
        error: "Attribute already exists for this user",
      });
    }

    return res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to add attribute",
    });
  }
};

export const updateUserAttribute = async (
  req: Request<AttributeParams>,
  res: Response
) => {
  try {
    const { attributeId } = req.params;
    const { value } = req.body;

    const attribute = await updateAttribute(
      req.user.userId,
      attributeId,
      value
    );

    return res.json(attribute);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        error: "Attribute not found",
      });
    }

    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to update attribute",
    });
  }
};

export const deleteUserAttribute = async (
  req: Request<AttributeParams>,
  res: Response
) => {
  try {
    const { attributeId } = req.params;

    await deleteAttribute(req.user.userId, attributeId);

    return res.sendStatus(204);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        error: "Attribute not found",
      });
    }

    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to delete attribute",
    });
  }
};
