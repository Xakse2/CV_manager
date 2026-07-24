import { Router } from "express";
import {
  getCV,
  generateCV,
  updateCVAttribute,
  getMyCV,
  publishCV,
  addLike,
} from "../controllers/cv.controller.js";
import { UserRole } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { cvAccessMiddleware } from "../middleware/cvAccess.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const routerCv: Router = Router();

routerCv.use(authMiddleware);

routerCv.get(
  "/cv/me/list",
  roleMiddleware(UserRole.CANDIDATE, UserRole.ADMIN),
  getMyCV
);
routerCv.post(
  "/cv",
  roleMiddleware(UserRole.CANDIDATE, UserRole.ADMIN),
  generateCV
);
routerCv.patch(
  "/cv/:id/attribute",
  roleMiddleware(UserRole.CANDIDATE, UserRole.ADMIN),
  cvAccessMiddleware,
  updateCVAttribute
);
routerCv.patch(
  "/cv/:id/publish",
  roleMiddleware(UserRole.CANDIDATE, UserRole.ADMIN),
  cvAccessMiddleware,
  publishCV
);
routerCv.get("/cv/:id", cvAccessMiddleware, getCV);
routerCv.post(
  "/cv/:id/like",
  roleMiddleware(UserRole.RECRUITER, UserRole.ADMIN),
  addLike
);

export default routerCv;
