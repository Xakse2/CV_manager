import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";

import { UserRole } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../util/jwt.js";
import type { UpdateUserData } from "../types/types.js";

const createSession = async (user: { id: string; role: UserRole }) => {
  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const registerUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      updatedAt: new Date(),
    },
  });

  const { accessToken, refreshToken } = await createSession(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const { accessToken, refreshToken } = await createSession(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const refreshSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!user || !user.refreshToken) {
    throw new Error("Unauthorized");
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!isValid) {
    throw new Error("Unauthorized");
  }

  const session = await createSession(user);

  return {
    user,
    ...session,
  };
};

export const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  });
};

export const updateCurrentUser = async (
  userId: string,
  data: UpdateUserData
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  return user;
};
