import { Router } from "express";
import {
  getAllAttributes,
  createAttribute,
  deleteAttribute,
} from "../controllers/attribute.controller.js";

const routerAttribute: Router = Router();

routerAttribute.get("/", getAllAttributes);
routerAttribute.post("/", createAttribute);
routerAttribute.delete("/:id", deleteAttribute);

export default routerAttribute;
