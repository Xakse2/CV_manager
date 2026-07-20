import {
  login,
  refresh,
  logout,
  me,
  register,
} from "../controllers/auth.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const routerAuth: Router = Router();

routerAuth.post("/register", register);
routerAuth.post("/login", login);
routerAuth.post("/refresh", refresh);
routerAuth.post("/logout", logout);
routerAuth.get("/me", authMiddleware, me);

export default routerAuth;
