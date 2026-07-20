import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "../types/types.js";

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: "15m",
  };

  return jwt.sign(payload, ACCESS_SECRET, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
