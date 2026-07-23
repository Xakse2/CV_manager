import { prisma } from "../prisma.js";

export const getMyAttributes = async (userId: string) => {
  return prisma.userAttribute.findMany({
    where: {
      userId,
    },
    include: {
      Attribute: true,
    },
    orderBy: {
      Attribute: {
        name: "asc",
      },
    },
  });
};

export const addAttribute = async (
  userId: string,
  attributeId: string,
  value: string = ""
) => {
  const exists = await prisma.userAttribute.findUnique({
    where: {
      userId_attributeId: {
        userId,
        attributeId,
      },
    },
  });

  if (exists) {
    throw new Error("Attribute already exists for this user");
  }

  return prisma.userAttribute.create({
    data: {
      userId,
      attributeId,
      value,
    },
    include: {
      Attribute: true,
    },
  });
};

export const updateAttribute = async (
  userId: string,
  attributeId: string,
  value: string
) => {
  return prisma.userAttribute.upsert({
    where: {
      userId_attributeId: {
        userId,
        attributeId,
      },
    },
    update: {
      value,
    },
    create: {
      userId,
      attributeId,
      value,
    },
    include: {
      Attribute: true,
    },
  });
};

export const deleteAttribute = async (userId: string, attributeId: string) => {
  return prisma.userAttribute.delete({
    where: {
      userId_attributeId: {
        userId,
        attributeId,
      },
    },
  });
};
