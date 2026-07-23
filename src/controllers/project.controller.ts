import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  getProjects,
  createNewProject,
  updateExistingProject,
  removeProject,
} from "../services/project.service.js";

export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const projects = await getProjects(req.user.userId);

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to load projects",
    });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await createNewProject(req.user.userId, req.body);

    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to create project",
    });
  }
};

export const updateProject = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const project = await updateExistingProject(
      req.user.userId,
      req.params.id,
      req.body
    );

    return res.json(project);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to update project",
    });
  }
};

export const deleteProject = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await removeProject(req.user.userId, req.params.id);

    return res.sendStatus(204);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to delete project",
    });
  }
};
