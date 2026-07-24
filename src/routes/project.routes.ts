import { Router } from "express";
import {
  getMyProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const routerProject: Router = Router();

routerProject.use(authMiddleware);

routerProject.get("/me/projects", getMyProjects);

routerProject.post("/me/projects", createProject);

routerProject.patch("/me/projects/:id", updateProject);

routerProject.delete("/me/projects/:id", deleteProject);

export default routerProject;
