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
            (item: { attributeId: string; value: string }) => ({
              attributeId: item.attributeId,
              required: true,
            })
          ),
        },
        PositionAccessRule: {
          create: requirements
            .filter(
              (item: { operator?: string; value?: string }) => item.operator
            )
            .map(
              (item: {
                attributeId: string;
                operator: string;
                value: string;
              }) => ({
                attributeId: item.attributeId,
                operator: item.operator,
                value: item.value,
              })
            ),
        },
      },
      include: {
        PositionAttribute: true,
        PositionAccessRule: true,
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
        PositionAccessRule: true,
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
        PositionAccessRule: true,
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

export const updateVacancy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    company,
    description,
    salaryFrom,
    salaryTo,
    requirements,
    version,
  } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid vacancy ID" });
  }

  try {
    const currentPosition = await prisma.position.findFirst({
      where: {
        id,
        version: Number(version),
      },
    });

    if (!currentPosition) {
      return res.status(404).json({
        error: "Version conflict or vacancy not found.",
      });
    }

    const fullUpdatedVacancy = await prisma.$transaction(async (item) => {
      await item.positionAttribute.deleteMany({ where: { positionId: id } });
      await item.positionAccessRule.deleteMany({ where: { positionId: id } });

      if (requirements && Array.isArray(requirements)) {
        await item.positionAttribute.createMany({
          data: requirements.map((item: { attributeId: string }) => ({
            positionId: id,
            attributeId: item.attributeId,
            required: true,
          })),
        });

        const accessRules = requirements.filter(
          (item: { operator?: string }) => item.operator
        );
        if (accessRules.length > 0) {
          await item.positionAccessRule.createMany({
            data: accessRules.map(
              (item: {
                attributeId: string;
                operator: string;
                value: string;
              }) => ({
                positionId: id,
                attributeId: item.attributeId,
                operator: item.operator,
                value: item.value,
              })
            ),
          });
        }
      }

      return await item.position.update({
        where: { id },
        data: {
          title,
          company,
          description,
          salaryFrom: salaryFrom ? Number(salaryFrom) : null,
          salaryTo: salaryTo ? Number(salaryTo) : null,
          version: currentPosition.version + 1,
        },
        include: {
          PositionAttribute: true,
          PositionAccessRule: true,
        },
      });
    });

    res.json(fullUpdatedVacancy);
  } catch (error) {
    console.error("error update vacancy:", error);
    res.status(500).json({ error: "update vacancy error" });
  }
};
