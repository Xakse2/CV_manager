import type { Request, Response } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  updateCurrentUser,
} from "../services/auth.service.js";
import { verifyRefreshToken } from "../util/jwt.js";
import { Prisma } from "@prisma/client";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const result = await registerUser({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    return res.status(500).json({
      error: "Register error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser({
      email,
      password,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
    });
  } catch (error) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const result = await refreshSession(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken: result.accessToken,
    });
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);

      await logoutUser(payload.userId);
    }

    res.clearCookie("refreshToken");

    return res.sendStatus(204);
  } catch {
    res.clearCookie("refreshToken");

    return res.sendStatus(204);
  }
};
export const me = async (req: Request, res: Response) => {
  try {
    const user = await getCurrentUser(req.user.userId);

    return res.json(user);
  } catch {
    return res.status(404).json({
      error: "User not found",
    });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;

  try {
    const user = await updateCurrentUser(req.user.userId, {
      firstName,
      lastName,
      email,
    });

    return res.json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(500).json({
      error: "Failed to update profile",
    });
  }
};
