import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { updateMe } from "../controllers/auth.controller.js";

const routerUser: Router = Router();

routerUser.patch("/me", authMiddleware, updateMe);

export default routerUser;
