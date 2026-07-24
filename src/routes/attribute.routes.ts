import { Router } from "express";
import {
  getAllAttributes,
  createAttribute,
  deleteAttribute,
} from "../controllers/attribute.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { UserRole } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.middleware.js";

const routerAttribute: Router = Router();

routerAttribute.use(authMiddleware);

routerAttribute.get("/", getAllAttributes);

routerAttribute.post(
  "/",
  roleMiddleware(UserRole.RECRUITER, UserRole.ADMIN),
  createAttribute
);

routerAttribute.delete(
  "/:id",
  roleMiddleware(UserRole.RECRUITER, UserRole.ADMIN),
  deleteAttribute
);

export default routerAttribute;
