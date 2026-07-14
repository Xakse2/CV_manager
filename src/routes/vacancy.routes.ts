import { Router } from "express";
import {
  createVacancy,
  getAllVacancies,
  getVacancyById,
  updateVacancy,
} from "../controllers/vacancy.controller.js";

const routerVacancy: Router = Router();

routerVacancy.get("/", getAllVacancies);
routerVacancy.get("/:id", getVacancyById);

routerVacancy.post("/", createVacancy);
routerVacancy.put("/:id", updateVacancy);

export default routerVacancy;
