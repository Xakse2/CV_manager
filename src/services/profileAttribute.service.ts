import { prisma } from "../prisma.js";

export const addAttributeToProfile = async (
  userId: string,
  attributeId: string
) => {
  const existing = await prisma.userAttribute.findUnique({
    where: {
      userId_attributeId: { userId, attributeId },
    },
  });

  if (existing) {
    throw new Error("Attribute already added to profile");
  }

  return prisma.userAttribute.create({
    data: {
      userId,
      attributeId,
      value: "",
    },
    include: {
      Attribute: true,
    },
  });
};

export const removeAttributeFromProfile = async (
  userId: string,
  attributeId: string
) => {
  return prisma.userAttribute.delete({
    where: {
      userId_attributeId: { userId, attributeId },
    },
  });
};
