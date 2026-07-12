import { prisma } from "../prisma.js";
import type { Request, Response } from "express";

export const createVacancy = async (req: Request, res: Response) => {
  const {
    title,
    company,
    description,
    salaryFrom,
    salaryTo,
    requirements,
    version,
  } = req.body;

  try {
    const newPosition = await prisma.position.create({
      data: {
        title,
        company,
        description,
        salaryFrom: salaryFrom ? Number(salaryFrom) : null,
        salaryTo: salaryTo ? Number(salaryTo) : null,
        version: version || 1,
        PositionAttribute: {
          create: requirements.map(
            (req: { attributeId: string; value: string }) => ({
              attributeId: req.attributeId,
              required: true,
            })
          ),
        },
      },
      include: {
        PositionAttribute: true,
      },
    });

    res.status(201).json(newPosition);
  } catch (error) {
    console.error("error create vacancy:", error);
    res.status(500).json({ error: "get vacancy error" });
  }
};

export const getAllVacancies = async (req: Request, res: Response) => {
  try {
    const vacancies = await prisma.position.findMany({
      include: {
        PositionAttribute: {
          include: {
            Attribute: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    res.json(vacancies);
  } catch (error) {
    console.error("error get vacancy:", error);
    res.status(500).json({ error: "get vacancy error" });
  }
};

export const getVacancyById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid vacancy ID" });
  }

  try {
    const vacancy = await prisma.position.findFirst({
      where: { id },
      include: {
        PositionAttribute: {
          include: {
            Attribute: true,
          },
        },
      },
    });

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    return res.json(vacancy);
  } catch (error) {
    console.error("error get vacancy:", error);
    res.status(500).json({ error: "get vacancy error" });
  }
};
