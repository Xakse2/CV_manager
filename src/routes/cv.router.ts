import { Router } from "express";
import {
  getCV,
  generateCV,
  updateCVAttribute,
  getMyCV,
} from "../controllers/cv.controller.js";

const routerCv: Router = Router();

routerCv.get("/cv/me/list", getMyCV);
routerCv.get("/:id", getCV);
routerCv.post("/", generateCV);
routerCv.patch("/:id/attribute", updateCVAttribute);

export default routerCv;
