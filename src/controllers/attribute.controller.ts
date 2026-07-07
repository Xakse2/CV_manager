import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import type { Request, Response } from "express";

export const getAllAttributes = async (req: Request, res: Response) => {
  try {
    const attributes = await prisma.attribute.findMany();
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ error: "attribute get error" });
  }
};

export const createAttribute = async (req: Request, res: Response) => {
  const { name, type, category, options } = req.body;

  try {
    const newAttribute = await prisma.attribute.create({
      data: {
        name,
        type,
        category,
        options,
      },
    });
    res.status(201).json(newAttribute);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "attribute already exists" });
      }
    }
    res.status(500).json({ error: "create attribute error" });
  }
};

export const deleteAttribute = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    await prisma.attribute.delete({
      where: { id },
    });
    return res.status(200).json({ message: "attribute deleted successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "attribute not found" });
      }
    }
    return res.status(500).json({ error: "delete attribute error" });
  }
};
