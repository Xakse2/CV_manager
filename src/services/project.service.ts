import { prisma } from "../prisma.js";

export interface CreateProjectDto {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  tags: string[];
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      userId,
    },
    orderBy: {
      startDate: "desc",
    },
  });
};

export const createNewProject = async (
  userId: string,
  data: CreateProjectDto
) => {
  return prisma.project.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      tags: data.tags,
    },
  });
};

export const updateExistingProject = async (
  userId: string,
  projectId: string,
  data: UpdateProjectDto
) => {
  return prisma.project.update({
    where: {
      id: projectId,
      userId,
    },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.startDate !== undefined && {
        startDate: new Date(data.startDate),
      }),
      ...(data.endDate !== undefined && {
        endDate: data.endDate ? new Date(data.endDate) : null,
      }),
      ...(data.tags !== undefined && { tags: data.tags }),
    },
  });
};

export const removeProject = async (userId: string, projectId: string) => {
  return prisma.project.delete({
    where: {
      id: projectId,
      userId,
    },
  });
};
