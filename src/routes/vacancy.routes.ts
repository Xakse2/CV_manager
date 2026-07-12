import { Router } from "express";
import {
  createVacancy,
  getAllVacancies,
  getVacancyById,
} from "../controllers/vacancy.controller.js";

const routerVacancy: Router = Router();

routerVacancy.post("/", createVacancy);
routerVacancy.get("/", getAllVacancies);
routerVacancy.get("/:id", getVacancyById);

export default routerVacancy;
