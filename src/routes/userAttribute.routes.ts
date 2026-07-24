import { Router } from "express";
import {
  getUserAttributes,
  createUserAttribute,
  updateUserAttribute,
  deleteUserAttribute,
} from "../controllers/userAttribute.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const routerUserAttribute: Router = Router();

routerUserAttribute.use(authMiddleware);

routerUserAttribute.get("/me/attributes", getUserAttributes);
routerUserAttribute.post("/me/attributes", createUserAttribute);
routerUserAttribute.patch("/me/attributes/:attributeId", updateUserAttribute);
routerUserAttribute.delete("/me/attributes/:attributeId", deleteUserAttribute);

export default routerUserAttribute;
