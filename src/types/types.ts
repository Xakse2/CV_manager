import { UserRole } from "@prisma/client";

export type JwtPayload = {
  userId: string;
  role: UserRole;
};

export type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  email?: string;
};
