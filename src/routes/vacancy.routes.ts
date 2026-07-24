import { Router } from "express";
import {
  createVacancy,
  getAllVacancies,
  getVacancyById,
  updateVacancy,
} from "../controllers/vacancy.controller.js";
import { UserRole } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const routerVacancy: Router = Router();

routerVacancy.get("/", getAllVacancies);
routerVacancy.get("/:id", getVacancyById);

routerVacancy.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.RECRUITER, UserRole.ADMIN),
  createVacancy
);

routerVacancy.put(
  "/:id",
  authMiddleware,
  roleMiddleware(UserRole.RECRUITER, UserRole.ADMIN),
  updateVacancy
);
export default routerVacancy;
