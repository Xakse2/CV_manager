import { prisma } from "../prisma.js";

export interface CreateCVDto {
  userId: string;
  positionId: string;
}

export const getGeneratedCV = async (cvId: string) => {
  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    include: {
      Like: true,
      User: {
        include: {
          UserAttribute: true,
        },
      },
      Position: {
        include: {
          PositionAttribute: {
            include: {
              Attribute: true,
            },
          },
        },
      },
      CVProject: {
        include: {
          Project: true,
        },
      },
    },
  });

  if (!cv) {
    throw new Error("CV not found");
  }

  const virtualAttributes = cv.Position.PositionAttribute.map((posAttr) => {
    const userValue = cv.User.UserAttribute.find(
      (ua) => ua.attributeId === posAttr.attributeId
    );

    return {
      ...posAttr.Attribute,
      required: posAttr.required,
      value: userValue ? userValue.value : null,
    };
  });

  return {
    id: cv.id,
    position: cv.Position.title,
    likes: cv.Like.length,
    candidate: `${cv.User.firstName} ${cv.User.lastName}`,
    attributes: virtualAttributes,
    projects: cv.CVProject.map((cvp) => cvp.Project),
    isPublished: cv.isPublished,
  };
};

export const createCV = async (userId: string, positionId: string) => {
  const existingCV = await prisma.cV.findUnique({
    where: {
      userId_positionId: {
        userId,
        positionId,
      },
    },
  });

  if (existingCV) {
    throw new Error("CV for this position already exists");
  }

  return prisma.cV.create({
    data: {
      userId,
      positionId,
      isPublished: false,
    },
  });
};

export const getMyCVs = async (userId: string) => {
  return prisma.cV.findMany({
    where: {
      userId,
    },
    include: {
      Position: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });
};

export const publishCVService = async (userId: string, cvId: string) => {
  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    include: {
      Position: {
        include: {
          PositionAttribute: true,
        },
      },
      User: {
        include: {
          UserAttribute: true,
        },
      },
    },
  });

  if (!cv) {
    throw new Error("CV not found");
  }

  if (cv.userId !== userId) {
    throw new Error("Access denied");
  }

  for (const attribute of cv.Position.PositionAttribute) {
    if (!attribute.required) continue;

    const value = cv.User.UserAttribute.find(
      (item) => item.attributeId === attribute.attributeId
    );

    if (!value || !value.value) {
      throw new Error("Required attributes are not filled");
    }
  }

  return prisma.cV.update({
    where: {
      id: cvId,
    },
    data: {
      isPublished: true,
    },
  });
};

export const toggleLikeCV = async (recruiterId: string, cvId: string) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      cvId_recruiterId: {
        cvId,
        recruiterId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        cvId_recruiterId: {
          cvId,
          recruiterId,
        },
      },
    });

    return {
      liked: false,
    };
  }

  await prisma.like.create({
    data: {
      cvId,
      recruiterId,
    },
  });

  return {
    liked: true,
  };
};
